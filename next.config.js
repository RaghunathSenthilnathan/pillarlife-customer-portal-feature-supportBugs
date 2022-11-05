"use strict";
/**
 * when next build command is run with ANALYZE=true env variable
 * this outputs 2 files - client.html and server.html to the <distDir>/analyze/ folder
 */
const path = require('path')
const withPlugins = require('next-compose-plugins');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

// const jsonLoader = require('json-loader')
// const sass = require('@zeit/next-sass');
// const withTM = require('next-plugin-transpile-modules');
const withCSS = require('@zeit/next-css')
const withPostCss = require('postcss')
const withTailwindcss = require('tailwindcss')
const withAutoprefixer = require('autoprefixer')

const nextEnv = require('next-env')
const dotenvLoad = require('dotenv-load')

// prefetch-src 'self';

const ContentSecurityPolicy = `
  base-uri 'self';  
  default-src 'self';
  connect-src 'self' https://api-core-pillar-life.socotra.com;
  script-src 'self' 'unsafe-eval';
  style-src 'self' 'unsafe-inline';
  font-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com;
  object-src 'self';
  img-src 'self' data:;
  frame-ancestors 'self';
`


const securityHeaders = [
  // {
  //   key: 'X-DNS-Prefetch-Control',
  //   value: 'on'
  // },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin'
  },
  {
    key: 'Content-Security-Policy',
    value: ContentSecurityPolicy.replace(/\s{2,}/g, ' ').trim()
  },
  {
    key: 'Cross-Origin-Resource-Policy',
    value: 'cross-origin'
  }

]


const corsHeaders = [
  // matching all API routes
  { key: "Access-Control-Allow-Credentials", value: "true" },
  { key: "Access-Control-Allow-Origin", value: "*" },
  { key: "Access-Control-Allow-Methods", value: "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
  { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization, X-Request-Id" },
]


dotenvLoad()

const withNextEnv = nextEnv()
module.exports = withNextEnv()

const nextConfig = {

  async headers() {
    return [
      // {
      //   // Apply these headers to all routes in your application.
      //   source: '/(.*)',
      //   headers: corsHeaders,
      // },
      // {
      //   // Apply these headers to all routes in your application.
      //   source: '/api/(.*)',
      //   headers: corsHeaders,
      // },
      {
        // Apply these headers to all routes in your application.
        source: '/(.*)',
        headers: securityHeaders,
      },
      // {
      //   // Apply these headers to all routes in your application.
      //   source: '/api/(.*)',
      //   headers: securityHeaders,
      // },


    ]
  },
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },
  future: {
    webpack5: true
  },
  // distDir: 'build',
  webpack: (config, { isServer }) => {
    console.log("ENVIRONMENT: " + process.env.NODE_ENV)
    isProduction = process.env.NODE_ENV === 'production'
    config.watchOptions = {
      poll: 1000,
      aggregateTimeout: 300,
    };
    config.node = {
      fs: "empty",
    };
    config.module.rules.push(
      {
        test: /\.css$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              importLoaders: 1,
              modules: true,
            },
          },
        ],
        include: /\.module\.css$/,
      }
    );
    config.module.rules.push({
      test: /\.s?[ac]ss$/,
      exclude: /\.module\.css$/,
      use: [
        {
          loader: MiniCssExtractPlugin.loader,
          options: {
            hmr: !isProduction,
            reloadAll: true,
          },
        },
        'postcss-loader',
        {
          loader: 'css-loader',
          options: {
            importLoaders: 1,
            modules: {
              localIdentName: '[name]__[local]___[hash:base64:5]',
            },
          },
        },

        { loader: 'sass-loader', options: { sourceMap: true } },
      ],
    });
    config.module.rules.push({
      test: /\.global.css$/,
      use: [
        {
          loader: MiniCssExtractPlugin.loader,
          options: {
            hmr: !isProduction,
            reloadAll: true,
          },
        },
        'css-loader',
        'postcss-loader',
      ],
    });
    return config;
  },
};

module.exports = withPlugins(
  [withBundleAnalyzer,
    {
      output: {
        hashFunction: "sha256"
      },
      pageExtensions: ['page.js', 'page.jsx'],
      webpack: function webpack(config) {
        config.module.rules.push({
          test: /\.(png|jpe?g|gif|svg|mp4)$/i,
          use: [
            {
              loader: 'file-loader',
              options: {
                publicPath: '/_next',
                name: 'static/media/[name].[hash].[ext]',
              },
            },
          ],
        });
        return config;
      }
    }
  ],



  nextConfig,
);
