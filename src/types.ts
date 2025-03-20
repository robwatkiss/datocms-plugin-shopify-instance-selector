export type FirstInstallationParameters = {
  shopifyStorefrontAccessToken: string;
  shopifyStorefrontUrl: string;
};

export type ValidParameters = {
  shopifyStorefrontAccessToken: string;
  shopifyStorefrontUrl: string;
};

export type Parameters = FirstInstallationParameters | ValidParameters;