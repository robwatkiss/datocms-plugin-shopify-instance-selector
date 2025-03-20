import { ValidParameters } from "../types";

export type Product = {
  id: string;
  handle: string;
  title: string;
  imageUrl: string;
  images: {
    edges: [
      {
        node: {
          src: string;
        };
      },
    ];
  };
};

export type Products = {
  edges: [{ node: Product }];
};

const productFragment = `
  id
  title
  handle
  images(first: 1) {
    edges {
      node {
        src: transformedSrc(maxWidth: 200, maxHeight: 200)
      }
    }
  }
`;

const normalizeProduct = (product: any): Product => {
  if (!product || typeof product !== 'object') {
    throw new Error('Invalid product');
  }

  return {
    ...product,
    imageUrl: product.images.edges[0]?.node.src || '',
  };
};

const normalizeProducts = (products: any): Product[] =>
  products.edges.map((edge: any) => normalizeProduct(edge.node));

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

  async productsMatching(query: string) {
    const response = await this.fetch({
      query: `
        query getProducts($query: String) {
            products(first: 10, query: $query) {
              edges {
                node {
                  ${productFragment}
                }
              }
          }
        }
      `,
      variables: { query: query || null },
    });
    return normalizeProducts(response.products);
  }

  async productByHandle(handle: string) {
    const response = await this.fetch({
      query: `
        query getProduct($handle: String!) {
          product: productByHandle(handle: $handle) {
            ${productFragment}
          }
        }
      `,
      variables: { handle },
    });

    return normalizeProduct(response.product);
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