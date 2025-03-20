import { RenderConfigScreenCtx } from 'datocms-plugin-sdk';
import {
  Button,
  Canvas,
  TextField,
  Form,
  FieldGroup,
} from 'datocms-react-ui';
import { Form as FormHandler, Field } from 'react-final-form';
import { Parameters } from '../types';

type PropTypes = {
  ctx: RenderConfigScreenCtx;
};

export default function ConfigScreen({ ctx }: PropTypes) {
  return (
    <Canvas ctx={ctx}>
      <FormHandler<Parameters>
        initialValues={ctx.plugin.attributes.parameters}
        validate={(values) => {
          console.log(values)
          const errors: Record<string, string> = {};

          if (!values.shopifyStorefrontAccessToken) {
            errors.shopifyStorefrontAccessToken = 'This field is required';
          } else {
            if (values.shopifyStorefrontAccessToken?.startsWith('shpat_')) {
              errors.shopifyStorefrontAccessToken = 'You have entered an Admin API key. Please enter a Storefront API key.';
            }
          }

          if (!values.shopifyStorefrontUrl) {
            errors.shopifyStorefrontUrl = 'This field is required';
          } else if (!values.shopifyStorefrontUrl.startsWith('https://')) {
            errors.shopifyStorefrontUrl = 'This field must be a valid URL';
          } else if (!values.shopifyStorefrontUrl.includes('.myshopify.com')) {
            errors.shopifyStorefrontUrl = 'This field must be a valid Shopify store URL';
          }

          return errors;
        }}
        onSubmit={async (values) => {
          await ctx.updatePluginParameters(values);
          ctx.notice('Settings updated successfully!');
        }}
      >
        {({ handleSubmit, submitting, dirty }) => (
          <Form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field name="shopifyStorefrontUrl">
                {({ input, meta: { error } }) => (
                  <TextField
                    id="storefrontUrl"
                    label="Storefront URL"
                    placeholder='https://your-store.myshopify.com'
                    hint='Enter your full Shopify store URL'
                    required
                    error={error}
                    {...input}
                  />
                )}
              </Field>

              <Field name="shopifyStorefrontAccessToken">
                {({ input, meta: { error } }) => (
                  <TextField
                    id="storefrontAccess Token"
                    label="Storefront Access Token"
                    required
                    error={error}
                    {...input}
                  />
                )}
              </Field>
            </FieldGroup>

            <Button
              type="submit"
              fullWidth
              buttonSize="l"
              buttonType="primary"
              disabled={submitting || !dirty}
            >
              Save settings
            </Button>
          </Form>
        )}
      </FormHandler>
    </Canvas>
  );
}