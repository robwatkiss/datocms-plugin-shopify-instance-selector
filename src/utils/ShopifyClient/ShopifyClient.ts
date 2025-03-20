import { ValidParameters } from "../../types";

export default class ShopifyClient {
  shopifyStorefrontAccessToken: string;
  shopifyStorefrontUrl: string;

  constructor({
    shopifyStorefrontAccessToken,
    shopifyStorefrontUrl,
  }: Pick<ValidParameters, 'shopifyStorefrontUrl' | 'shopifyStorefrontAccessToken'>) {
    this.shopifyStorefrontAccessToken = shopifyStorefrontAccessToken;
    this.shopifyStorefrontUrl = shopifyStorefrontUrl;
  }

  async fetchByHandle(_query: string): Promise<any> {
    throw new Error('Not implemented');
  }

  async fetchMatching(_id: string): Promise<any> {
    throw new Error('Not implemented');
  }

  get shopifySubdomain() {
    // shopifyStorefrontUrl is a full URL, extract the subdomain so we can be sure it's formatted correctly
    const url = new URL(this.shopifyStorefrontUrl);
    return url.hostname.split('.')[0];
  }

  async fetch(requestBody: any) {
    const res = await fetch(
      `https://${this.shopifySubdomain}.myshopify.com/api/graphql`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': this.shopifyStorefrontAccessToken,
        },
        body: JSON.stringify(requestBody),
      },
    );

    if (res.status !== 200) {
      throw new Error(`Invalid status code: ${res.status}`);
    }

    const contentType = res.headers.get('content-type');

    if (!contentType || !contentType.includes('application/json')) {
      throw new Error(`Invalid content type: ${contentType}`);
    }

    const body = await res.json();

    return body.data;
  }
}