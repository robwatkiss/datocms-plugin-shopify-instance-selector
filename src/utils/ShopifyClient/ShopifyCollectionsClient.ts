import ShopifyClient from './ShopifyClient';

export type Collection = {
  __typename: 'collection';
  id: string;
  handle: string;
  title: string;
  imageUrl: string;
  image?: {
    src: string;
  };
};

export type Collections = {
  edges: [{ node: Collection }];
};

const collectionFragment = `
  id
  title
  handle
  image {
    src: transformedSrc(maxWidth: 200, maxHeight: 200)
  }
`;

const normalizeCollection = (collection: any): Collection => {
  if (!collection || typeof collection !== 'object') {
    throw new Error('Invalid collection');
  }

  return {
    __typename: 'collection',
    ...collection,
    imageUrl: collection.image?.src || '',
  };
};

const normalizeCollections = (collections: any): Collection[] =>
  collections.edges.map((edge: any) => normalizeCollection(edge.node));

export default class ShopifyCollectionsClient extends ShopifyClient {
  async fetchMatching(query: string) {
    const response = await this.fetch({
      query: `
        query getCollections($query: String) {
          collections(first: 100, query: $query) {
            edges {
              node {
                ${collectionFragment}
              }
            }
          }
        }
      `,
      variables: { query: query || null },
    });
    return normalizeCollections(response.collections);
  }
}