// This file is used for production builds.
// Bitflow branding — override via build pipeline using same keys as BITFLOW_LOGO_URL / BITFLOW_SITE_URL if needed.
export const environment = {
    production: true,
    apiUrl: 'https://api.cafedelvalle.ec/api',
    bitflowLogoUrl: 'https://bitflow-public.s3.us-east-1.amazonaws.com/Bitflow-logo.png',
    bitflowSiteUrl: 'https://bitflow.bid'
};
