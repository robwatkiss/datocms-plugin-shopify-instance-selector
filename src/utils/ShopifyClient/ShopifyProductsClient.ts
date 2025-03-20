import ShopifyClient from './ShopifyClient';

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

export default class ShopifyProductsClient extends ShopifyClient {
  async fetchMatching(query: string) {
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
  
  async fetchByHandle (id: string) {
    const response = await this.fetch({
      query: `
        query getProduct($id: ID!) {
          product (id: $id) {
            ${productFragment}
          }
        }
      `,
      variables: { id },
    });
  
    return normalizeProduct(response.product);
  }
}