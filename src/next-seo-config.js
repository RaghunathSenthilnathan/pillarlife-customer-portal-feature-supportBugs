// import { FRONTEND_BASE_URL } from './constants';
const title = 'Pillarlife title';
const description = 'Pillarlife desc';
const SEO = {
    title,
    titleTemplate: '%s',
    description,
    canonical: process.env.FRONTEND_BASE_URL,
    openGraph: {
        type: 'website',
        locale: 'en_IE',
        url: process.env.FRONTEND_BASE_URL,
        title,
        description,
    },
};
export default SEO;
