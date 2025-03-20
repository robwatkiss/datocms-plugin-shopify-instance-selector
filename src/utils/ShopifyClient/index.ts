import { ValidParameters } from "../../types";
import ShopifyProductsClient from "./ShopifyProductsClient"
import ShopifyProductVariantsClient from "./ShopifyProductVariantsClient";

import type { Product } from './ShopifyProductsClient';
import type { ProductVariant } from './ShopifyProductVariantsClient';

export type ShopifyEntity = Product | ProductVariant;

interface GetClientArgs {
  type: string;
  parameters: Pick<ValidParameters, 'shopifyStorefrontUrl' | 'shopifyStorefrontAccessToken'>;
}
export default function getShopifyClient ({ type, parameters }: GetClientArgs) {
  switch (type) {
    case 'product':
      return new ShopifyProductsClient(parameters);
    case 'product-variant':
      return new ShopifyProductVariantsClient(parameters);
    default:
      throw new Error(`Invalid client type: ${type}`);
  }
}