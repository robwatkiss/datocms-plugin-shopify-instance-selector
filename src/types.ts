export type FirstInstallationParameters = {};

export type ValidParameters = {
  shopifyStorefrontAccessToken: string;
  shopifyStorefrontUrl: string;
};

export type Parameters = FirstInstallationParameters | ValidParameters;