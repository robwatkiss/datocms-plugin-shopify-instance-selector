import { RenderFieldExtensionCtx } from 'datocms-plugin-sdk';
import { Canvas } from 'datocms-react-ui';
import { ShopifyInstanceTypes } from '../constants/shopify-instance-types';
import Empty from '../components/Empty';

type PropTypes = {
    ctx: RenderFieldExtensionCtx;
};

export default function InstanceSelectorExtension ({ ctx }: PropTypes) {
    // Determine the field type
    const shopifyInstanceTypeKey = ctx.parameters.shopifyInstanceType.value;
    const shopifyInstanceType = ShopifyInstanceTypes.find(
      (type) => type.value === shopifyInstanceTypeKey,
    );
    if (!shopifyInstanceType) {
      return <Canvas ctx={ctx}>Invalid instance type: {shopifyInstanceTypeKey}</Canvas>;
    }
    console.log(shopifyInstanceType);
  
    return (
      <Canvas ctx={ctx}>
        <Empty
          instanceType={shopifyInstanceTypeKey}
          onSelect={(item) => console.log(item)}
        />
      </Canvas>
    );
}