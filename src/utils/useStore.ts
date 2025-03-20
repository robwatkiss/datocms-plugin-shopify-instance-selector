import { produce } from 'immer';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import ShopifyClient from './ShopifyClient/ShopifyClient';
import type { Product } from './ShopifyClient';

export type Status = 'loading' | 'success' | 'error';

export type State = {
  query: string;
  searches: Record<string, { result: string[] | null; status: Status }>;
  entities: Record<string, { result: Product | null; status: Status }>;
  getEntity (handle: string): {
    status: Status;
    entity: Product | null;
  };
  getCurrentSearch(): {
    query: string;
    status: Status;
    entities: Product[] | null;
  };
  fetchEntityByHandle(client: ShopifyClient, type: string, handle: string): Promise<void>;
  fetchEntitiesMatching(client: ShopifyClient, type: string, query: string): Promise<void>;
};

const useStore = create(
  persist(
    (rawSet, get) => {
      const set = (setFn: (s: State) => void) => {
        return rawSet(produce(setFn));
      };

      return {
        query: '',
        entities: {},
        searches: {},
        getEntity(id: string) {
          const selectedEntity = (get() as State).entities[id];

          return {
            status: selectedEntity?.status ? selectedEntity.status : 'loading',
            entity: selectedEntity?.result,
          };
        },
        getCurrentSearch(type: string) {
          const state = get() as State;
        
          const search = state.searches[`${type}:${state.query}`] || {
            status: 'loading',
            result: [],
          };

          console.log(search)

          const entities =
            search.result &&
            search.result.map((id: string) => state.entities[id]?.result || undefined);

          return {
            query: state.query,
            status: search.status,
            entities: entities || null
          };
        },
        async fetchEntityByHandle(client: ShopifyClient, type: string, handle: string) {
          console.log('fetchEntityByHandle', type, handle);
          // set((state) => {
          //   const key = `${type}:${handle}`;
          //   state.entities[key] = state.entities[key] || { result: null };
          //   state.entities[key].status = 'loading';
          // });

          // try {
          //   const item = await client.fetchByHandle(type, handle);
          //   set((state) => {
          //     const key = `${type}:${handle}`;
          //     state.entities[key].result = item;
          //     state.entities[key].status = 'success';
          //   });
          // } catch {
          //   set((state) => {
          //     const key = `${type}:${handle}`;
          //     state.entities[key].result = null;
          //     state.entities[key].status = 'error';
          //   });
          // }
        },
        async fetchEntitiesMatching(client: ShopifyClient, type: string, query: string) {
          set((state) => {
            const key = `${type}:${query}`;
            state.searches[key] = state.searches[key] || { result: [] };
            state.searches[key].status = 'loading';
            state.query = query;
          });

          try {
            const items = await client.fetchMatching(query);
            set((state) => {
              const key = `${type}:${query}`;
              state.searches[key].status = 'success';
              state.searches[key].result = items.map((i) => i.id);
              items.forEach((item) => {
                state.entities[item.id] = state.entities[item.id] || {};
                state.entities[item.id].result = item;
              });
            });
          } catch {
            set((state) => {
              const key = `${type}:${query}`;
              state.searches[key].status = 'error';
              state.searches[key].result = null;
            });
          }
        },
      };
    },
    {
      name: 'datocms-plugin-shopify-instance-selector',
    },
  ),
);

export default useStore;