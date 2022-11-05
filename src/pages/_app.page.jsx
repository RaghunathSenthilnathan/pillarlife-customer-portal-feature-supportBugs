import { Amplify } from "@aws-amplify/core";
import { Auth } from "@aws-amplify/auth";
import { Container } from "@components/layout";
import { Navbar } from "@components/navbar";
import { AuthProvider } from "@context/auth";
import { NotificationProvider } from "@context/notification";
import "@styles/tailwind.css";
import "@styles/global.css";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import { DefaultSeo } from "next-seo";
import Head from "next/head";
import { StrictMode } from "react";
import SEO from "src/next-seo-config";
import store from "./store";
import { Provider } from "react-redux";
import TagManager from "react-gtm-module";

function saveToLocalStorage(state) {
  try {
    const serialisedState = JSON.stringify(state);
    localStorage.setItem("persistantState", serialisedState);
  } catch (e) {
    console.warn(e);
  }
}

store.subscribe(() => saveToLocalStorage(store.getState()));

Amplify.configure({
  Auth: {
    // REQUIRED only for Federated Authentication - Amazon Cognito Identity Pool ID
    identityPoolId: process.env.NEXT_PUBLIC_IDENTITY_POOL_ID,

    // REQUIRED - Amazon Cognito Region
    region: process.env.NEXT_PUBLIC_REGION,

    // OPTIONAL - Amazon Cognito Federated Identity Pool Region
    // Required only if it's different from Amazon Cognito Region
    identityPoolRegion: process.env.NEXT_PUBLIC_REGION,

    // OPTIONAL - Amazon Cognito User Pool ID
    userPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID,

    // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
    userPoolWebClientId: process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID,

    // OPTIONAL - Enforce user authentication prior to accessing AWS resources or not
    mandatorySignIn: false,

    authenticationFlowType: "USER_SRP_AUTH",

    oauth: {
      domain: "pillarlife-dev.auth.us-east-1.amazoncognito.com",
      scope: [
        "phone",
        "email",
        "profile",
        "openid",
        "aws.cognito.signin.user.admin",
      ],
      redirectSignIn: process.env.NEXT_PUBLIC_REDIRECT_SIGN_IN,
      redirectSignOut: process.env.NEXT_PUBLIC_REDIRECT_SIGN_OUT,
      responseType: "code", // or 'token', note that REFRESH token will only be generated when the responseType is code
    },
  },
  ssr: true,
});

Amplify.Logger.LOG_LEVEL = "WARN";

Auth.configure({
  region: process.env.NEXT_PUBLIC_REGION, // (required) - Region where Amazon Cognito project was created
  userPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID, // (optional) -  Amazon Cognito User Pool ID
  userPoolWebClientId: process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID, // (optional) - Amazon Cognito App Client ID (App client secret needs to be disabled)
  identityPoolId: process.env.NEXT_PUBLIC_IDENTITY_POOL_ID, // (optional) - Amazon Cognito Identity Pool ID
  mandatorySignIn: false, // (optional) - Users are not allowed to get the aws credentials unless they are signed in
  authenticationFlowType: "USER_SRP_AUTH",
  identityPoolRegion: process.env.NEXT_PUBLIC_REGION,
  oauth: {
    domain: process.env.NEXT_PUBLIC_IDP_DOMAIN,
    scope: ["email", "openid", "profile", "aws.cognito.signin.user.admin"],
    redirectSignIn: process.env.NEXT_PUBLIC_REDIRECT_SIGN_IN,
    redirectSignOut: process.env.NEXT_PUBLIC_REDIRECT_SIGN_OUT,
    responseType: "code",
  },
});

// Amplify.Logger.LOG_LEVEL = 'DEBUG';

const navbarHeight = "172px";
const footerHeight = "232px";



const App = ({ Component, pageProps }) => {
  return (
    <Provider store={store}>
      <StrictMode>
        <Head>
          <meta content="IE=edge" httpEquiv="X-UA-Compatible" />
          <meta content="width=device-width, initial-scale=1" name="viewport" />
        </Head>
        <DefaultSeo {...SEO} />
        {/* <noscript>
          <iframe
            src="ns"
            height="0"
            width="0"
            style={"display:none;visibility:hidden"}
          ></iframe>
        </noscript> */}
        <div className="bg-white">
          <NotificationProvider>
            <AuthProvider>
              <Navbar />
              <Container
                className="mx-auto"
                style={{
                  minHeight: `calc(100vh - ${navbarHeight} - ${footerHeight})`,
                }}
              >
                <Component {...pageProps} />
              </Container>
            </AuthProvider>
          </NotificationProvider>
        </div>
      </StrictMode>
    </Provider>
  );
};

export default App;
