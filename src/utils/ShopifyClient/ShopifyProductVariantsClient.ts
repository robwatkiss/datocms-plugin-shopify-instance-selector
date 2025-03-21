import ShopifyClient from './ShopifyClient';

export type ProductVariant = {
  __typename: 'product-variant';
  id: string;
  title: string;
  sku: string;
  imageUrl: string;
  productId: string;
};

type Product = {
  id: string;
  handle: string;
  title: string;
};


const productFragment = `
  id
  title
  handle
  variants (first: 100) {
    edges {
      node {
        id
        title
        sku
        image {
          src: transformedSrc(maxWidth: 200, maxHeight: 200)
        }
      }
    }
  }
`;

const normalizeProductVariant = (productVariant: any, productId: string): Product => {
  if (!productVariant || typeof productVariant !== 'object') {
    throw new Error('Invalid product variant');
  }

  console.log(productVariant)

  return {
    __typename: 'product-variant',
    ...productVariant,
    productId,
    imageUrl: productVariant.image?.src
  };
};

const normalizeProductVariants = (products: any): Product[] =>
  products.edges.flatMap(
    (product: any) => product.node.variants.edges.map(
      (variant: any) => normalizeProductVariant(variant.node, product.node.id)
    )
  )

export default class ShopifyProductVariantsClient extends ShopifyClient {
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
    return normalizeProductVariants(response.products);
  }
}