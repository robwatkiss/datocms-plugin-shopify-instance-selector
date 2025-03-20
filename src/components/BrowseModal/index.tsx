import { RenderModalCtx } from 'datocms-plugin-sdk';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Button, TextInput, Canvas, Spinner, ContextInspector} from 'datocms-react-ui';
import s from './styles.module.css';
import getShopifyClient, { Product } from '../../utils/ShopifyClient';
import useStore, { State } from '../../utils/useStore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames';
import { ValidParameters } from '../../types';

export default function BrowseModal({ ctx }: { ctx: RenderModalCtx }) {
  const instanceType = ctx.parameters.shopifyInstanceType.value;

  const performSearch = useStore((state) => (state as State).fetchEntitiesMatching);
  const currentSearch = useStore((state) => (state as State).getCurrentSearch(instanceType));

  const [query, setQuery] = useState<string>(currentSearch.query);

  const { shopifyStorefrontAccessToken, shopifyStorefrontUrl } = ctx.plugin.attributes.parameters as ValidParameters;

  const client = useMemo(() => {
    return getShopifyClient({
      type: instanceType,
      parameters: { shopifyStorefrontAccessToken, shopifyStorefrontUrl }
    });
  }, [instanceType, shopifyStorefrontAccessToken, shopifyStorefrontUrl]);

  useEffect(() => {
    performSearch(client, instanceType, currentSearch.query);
  }, [performSearch, instanceType, currentSearch.query, client]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    performSearch(client, instanceType, query);
  };

  return (
    <Canvas ctx={ctx}>
      <ContextInspector />

      <div className={s['browse']}>
        <form className={s['search']} onSubmit={handleSubmit}>
          <TextInput
            placeholder="Search query..."
            id="query"
            name="query"
            value={query}
            onChange={setQuery}
            className={s['search__input']}
          />

          <Button
            type="submit"
            buttonType="primary"
            buttonSize="s"
            leftIcon={<FontAwesomeIcon icon={faSearch} />}
            disabled={currentSearch.status === 'loading'}
          >
            Search
          </Button>
        </form>
        <div className={s['container']}>
          {currentSearch.entities?.filter((x: any) => !!x) && (
            <div
              className={classNames(s['entities'], {
                [s['entities__loading']]: currentSearch.status === 'loading',
              })}
            >
              {currentSearch.entities.map((product: Product) => (
                <button
                  key={product.handle}
                  onClick={() => ctx.resolve(product)}
                  className={s['product']}
                >
                  <div
                    className={s['product__image']}
                    style={{ backgroundImage: `url(${product.imageUrl})` }}
                  />
                  <div className={s['product__content']}>
                    <div className={s['product__title']}>{product.title}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
          {currentSearch.status === 'loading' && <Spinner size={25} placement="centered" />}
          {currentSearch.status === 'success' && currentSearch.entities && currentSearch.entities.length === 0 && (
            <div className={s['empty']}>No entities found!</div>
          )}
          {currentSearch.status === 'error' && (
            <div className={s['empty']}>API call failed!</div>
          )}
        </div>
      </div>
    </Canvas>
  );
}