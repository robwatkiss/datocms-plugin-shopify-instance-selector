import { useCtx } from 'datocms-react-ui';
import { RenderFieldExtensionCtx } from 'datocms-plugin-sdk';
import s from './styles.module.css';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';
import { ShopifyEntity } from '../../utils/ShopifyClient';
import { ShopifyInstanceTypes } from '../../constants/shopify-instance-types';

export type ValueProps = {
  value: ShopifyEntity;
  onReset: () => void;
};

export default function Value({ value, onReset }: ValueProps) {
  const ctx = useCtx<RenderFieldExtensionCtx>();

  const instanceType = (ctx.parameters.shopifyInstanceType as { value: string }).value;
  const instanceTypeDetails = ShopifyInstanceTypes.find(
    (type) => type.value === instanceType,
  )

  const getSubtitle = (value: ShopifyEntity) => {
    switch (value.__typename) {
      case 'product':
        return value.handle;
      case 'product-variant':
        return value.sku;
      default:
        return '';
    }
  };

  return (
    <div
      className={classNames(s['value'], {
        [s['loading']]: status === 'loading',
      })}
    >
      {status === 'error' && (
        <div className={s['entity']}>
          API Error! Could not fetch details for product:&nbsp;
          <code>{JSON.stringify(value, null, 2)}</code>
        </div>
      )}
      {value && (
        <div className={s['entity']}>
          {value.imageUrl && <div
            className={s['entity__image']}
            style={{ backgroundImage: `url(${value.imageUrl})` }}
          />}

          <div className={s['entity__info']}>
            <div className={s['entity__type-tag']}>
              {instanceTypeDetails?.label}
            </div>

            <div className={s['entity__title']}>
              {value.title}
            </div>
            <div className={s['entity__subtitle']}>
              {getSubtitle(value)}
            </div>
            <div className={s['entity__subtitle']}>
              {value.id }
            </div>
          </div>
        </div>
      )}
      <button type="button" onClick={onReset} className={s['reset']}>
        <FontAwesomeIcon icon={faTimesCircle} />
      </button>
    </div>
  );
}