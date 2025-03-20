import { RenderManualFieldExtensionConfigScreenCtx } from 'datocms-plugin-sdk';
import { Canvas, Form, SelectField } from 'datocms-react-ui';
import { useCallback, useState } from 'react';
import { ShopifyInstanceTypes } from '../constants/shopify-instance-types';

type PropTypes = {
  ctx: RenderManualFieldExtensionConfigScreenCtx;
};

type Parameters = {
  shopifyInstanceType: string
};

export default function InstanceSelectorConfigScreen ({ ctx }: PropTypes) {
  const [formValues, setFormValues] = useState<Partial<Parameters>>(
    ctx.parameters,
  );

  const update = useCallback((field: string, value: Parameters['shopifyInstanceType']) => {
    const newParameters = { ...formValues, [field]: value };
    setFormValues(newParameters);
    ctx.setParameters(newParameters);
  }, [formValues, setFormValues, ctx.setParameters]);

  return (
    <Canvas ctx={ctx}>
      <Form>
        <SelectField
          id="shopifyInstanceType"
          name="shopifyInstanceType"
          label="Instance Type"
          hint="Select the type of instance you want to display"
          required
          value={formValues.shopifyInstanceType}
          // @ts-ignore
          onChange={update.bind(null, 'shopifyInstanceType')}
          selectInputProps={{
            // @ts-ignore
            options: ShopifyInstanceTypes.map((type) => ({
              value: type.value,
              label: type.label
            }))
          }}
        />
      </Form>
    </Canvas>
  );
}