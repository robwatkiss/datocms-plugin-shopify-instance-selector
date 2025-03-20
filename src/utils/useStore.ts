import { produce } from 'immer';
import { create } from 'zustand';
import ShopifyClient from './ShopifyClient/ShopifyClient';
import type { ShopifyEntity } from './ShopifyClient';

export type Status = 'loading' | 'success' | 'error';

export type State = {
  query: string;
  searches: Record<string, { result: string[] | null; status: Status }>;
  entities: Record<string, { result: ShopifyEntity | null; status: Status }>;
  getEntity (handle: string): {
    status: Status;
    entity: ShopifyEntity | null;
  };
  getCurrentSearch(type: string): {
    query: string;
    status: Status;
    entities: ShopifyEntity[] | null;
  };
  fetchEntityById(client: ShopifyClient, type: string, id: string): Promise<void>;
  fetchEntitiesMatching(client: ShopifyClient, type: string, query: string): Promise<void>;
};

const useStore = create(
  (rawSet, get) => {
    const set = (setFn: (s: State) => void) => {
      return rawSet(produce(setFn));
    };

    return {
      query: '',
      entities: {},
      searches: {},
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
      async fetchEntitiesMatching(client: ShopifyClient, type: string, query: string) {
        set((state) => {
          const key = `${type}:${query}`;
          state.searches[key] = state.searches[key] || { result: [] };
          state.searches[key].status = 'loading';
          state.query = query;
        });

        try {
          const items = (await client.fetchMatching(query)) as ShopifyEntity[];
          set((state) => {
            const key = `${type}:${query}`;
            state.searches[key].status = 'success';
            state.searches[key].result = items.map((i) => i.id);
            items.forEach((item) => {
              state.entities[item.id] = state.entities[item.id] || {};
              state.entities[item.id].result = item;
            });
          });
        } catch (e) {
          console.error(e);
          set((state) => {
            const key = `${type}:${query}`;
            state.searches[key].status = 'error';
            state.searches[key].result = null;
          });
        }
      },
    };
  }
);

export default useStore;