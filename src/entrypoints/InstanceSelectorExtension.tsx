import { RenderFieldExtensionCtx } from 'datocms-plugin-sdk';
import { Canvas } from 'datocms-react-ui';
import { ShopifyInstanceTypes } from '../constants/shopify-instance-types';
import Empty from '../components/Empty';
import Value from '../components/Value';
import type { ShopifyEntity } from '../utils/ShopifyClient';
import get from 'lodash-es/get';

type PropTypes = {
    ctx: RenderFieldExtensionCtx;
};

export default function InstanceSelectorExtension ({ ctx }: PropTypes) {
    // Determine the field type
    const shopifyInstanceTypeKey = (ctx.parameters.shopifyInstanceType as { value: string }).value
    const shopifyInstanceType = ShopifyInstanceTypes.find(
      (type) => type.value === shopifyInstanceTypeKey,
    );
    if (!shopifyInstanceType) {
      return <Canvas ctx={ctx}>Invalid instance type: {shopifyInstanceTypeKey}</Canvas>;
    }

    const rawValue = get(ctx.formValues, ctx.fieldPath) as string;
    const value = rawValue ? JSON.parse(rawValue) : null;
    
    const handleSelect = (entity: ShopifyEntity) => {
      ctx.setFieldValue(
        ctx.fieldPath,
        JSON.stringify(entity),
      );
    };
  
    const handleReset = () => {
      ctx.setFieldValue(ctx.fieldPath, null);
    };
  
  
    return (
      <Canvas ctx={ctx}>
        {value ? (
          <Value value={value} onReset={handleReset} />
        ) : (
          <Empty
            instanceType={shopifyInstanceTypeKey}
            onSelect={(item) => handleSelect(item)}
          />
        )}
      </Canvas>
    );
}