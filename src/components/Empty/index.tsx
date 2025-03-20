import { Button, useCtx } from 'datocms-react-ui';
import s from './styles.module.css';
import { ShopifyEntity } from '../../utils/ShopifyClient';
import { RenderFieldExtensionCtx } from 'datocms-plugin-sdk';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { ShopifyInstanceTypes } from '../../constants/shopify-instance-types';

export type EmptyProps = {
  instanceType: string;
  onSelect: (entity: ShopifyEntity) => void;
};

export default function Empty({ onSelect }: EmptyProps) {
  const ctx = useCtx<RenderFieldExtensionCtx>();

  const instanceType = ctx.field.attributes.appearance.parameters.shopifyInstanceType as { value: string };
  const instanceTypeDetails = ShopifyInstanceTypes.find(
    (type) => type.value === instanceType.value,
  )

  const handleOpenModal = async () => {
    const entity = (await ctx.openModal({
      id: 'browse',
      title: 'Browse Shopify',
      width: 'xl',
      parameters: {
        shopifyInstanceType: instanceType
      },
    })) as ShopifyEntity | null;



    if (entity) {
      onSelect(entity);
    }
  };

  return (
    <div className={s['empty']}>
      <div className={s['empty__label']}>No {instanceTypeDetails?.label.toLocaleLowerCase()} selected!</div>
      <Button
        onClick={handleOpenModal}
        buttonSize="s"
        leftIcon={<FontAwesomeIcon icon={faSearch} />}
      >
        Browse {instanceTypeDetails?.labelPlural}
      </Button>
    </div>
  );
}