import React, { useCallback, useContext, useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
import { ItemProps } from './ProductProps';
import { createItem, getItems, newWebSocket, updateItem } from './ProductApi';
import { AuthContext } from '../Authentication/AuthProvider';
import { Plugins } from '@capacitor/core';

type SaveItemFn = (item: ItemProps, items: ItemProps[]) => Promise<any>;
type SearchNextFn = ($event: CustomEvent<void>, products?: ItemProps[]) => Promise<any>;

export interface ItemsState {
  items?: ItemProps[],
  fetching: boolean,
  fetchingError?: Error | null,
  saving: boolean,
  savingError?: Error | null,
  saveItem?: SaveItemFn,
  searchNext?: SearchNextFn,
  disableInfiniteScroll: boolean

}

interface ActionProps {
  type: string,
  payload?: any,
}

const initialState: ItemsState = {
  fetching: false,
  saving: false,
  disableInfiniteScroll: false
};

const FETCH_ITEMS_STARTED = 'FETCH_ITEMS_STARTED';
const FETCH_ITEMS_SUCCEEDED = 'FETCH_ITEMS_SUCCEEDED';
const FETCH_ITEMS_FAILED = 'FETCH_ITEMS_FAILED';
const SAVE_ITEM_STARTED = 'SAVE_ITEM_STARTED';
const SAVE_ITEM_SUCCEEDED = 'SAVE_ITEM_SUCCEEDED';
const SAVE_ITEM_FAILED = 'SAVE_ITEM_FAILED';
const LOCAL_STORAGE = 'LOCAL_STORAGE';

const reducer: (state: ItemsState, action: ActionProps) => ItemsState =
  (state, { type, payload }) => {
    switch (type) {
      case FETCH_ITEMS_STARTED:
        return { ...state, fetching: true, fetchingError: null };
      case FETCH_ITEMS_SUCCEEDED:
        return { ...state, items: payload.items, fetching: false, disableInfiniteScroll: false };
      case FETCH_ITEMS_FAILED:
        return { ...state, fetchingError: payload.error, fetching: false };
      case SAVE_ITEM_STARTED:
        return { ...state, savingError: null, saving: true };
      case LOCAL_STORAGE:
        return { ...state, disableInfiniteScroll: true };
      case SAVE_ITEM_SUCCEEDED:
        const items = [...(state.items || [])];
        const item = payload.item;
        const index = items.findIndex(it => it.id === item.id);
        
        if (index === -1) {
          //items.splice(0, 0, item);
        } else {
          items[index] = item;
        }
        return { ...state, items, saving: false };
      case SAVE_ITEM_FAILED:
        return { ...state, savingError: payload.error, saving: false };
      default:
        return state;
    }
  };

export const ItemContext = React.createContext<ItemsState>(initialState);

interface ItemProviderProps {
  children: PropTypes.ReactNodeLike,
}

export const ItemProvider: React.FC<ItemProviderProps> = ({ children }) => {
  const noPageProducts = 3; 
  let page = 0;

  const { token } = useContext(AuthContext);
  const [state, dispatch] = useReducer(reducer, initialState);
  const { items, fetching, fetchingError, saving, savingError, disableInfiniteScroll } = state;
  useEffect(getItemsEffect, [token]);
  useEffect(wsEffect, [token]);
  const saveItem = useCallback<SaveItemFn>(saveItemCallback, [token]);
  const searchNext = useCallback<SearchNextFn>(getNextPage, [token]);
  const value = { items, fetching, fetchingError, saving, savingError, saveItem, disableInfiniteScroll, searchNext };
  
  return (
    <ItemContext.Provider value={value}>
      {children}
    </ItemContext.Provider>
  );

  async function getNextPage($event: CustomEvent<void>, products?: ItemProps[]) {
    page += 1;
    const noExcesItems = products!.length % noPageProducts
    if(noExcesItems !== 0)
    {
      page -= 1;
      products?.splice(-noExcesItems,noExcesItems);
    }
    dispatch({ type: FETCH_ITEMS_STARTED });
    let new_products: ItemProps[] = await getItems(token, noPageProducts, page);

    if(new_products.length === 0){
      page -= 1;
    }

    if(products){
      const result_products = [...products, ...new_products];

      const { Storage } = Plugins
      await Storage.set({
        key: 'items',
        value: JSON.stringify(result_products)
      });

      dispatch({ type: FETCH_ITEMS_SUCCEEDED, payload: { items: result_products } });
    }

    await ($event.target as HTMLIonInfiniteScrollElement).complete();
  }  

  function getItemsEffect() {
    let canceled = false;
    fetchItems();
    return () => {
      canceled = true;
    }

    async function fetchItems() {
      if (!token?.trim()) {
        return;
      }
      try {
        dispatch({ type: FETCH_ITEMS_STARTED });
        page += 1;
        const items = await getItems(token, noPageProducts, page);
        const { Storage } = Plugins
        
        if (!canceled) {
          dispatch({ type: FETCH_ITEMS_SUCCEEDED, payload: { items } });
          await Storage.set({
            key: 'items',
            value: JSON.stringify(items)
          });
        }
      } catch (error) {
        const { Storage } = Plugins;
        const itemsSaved = await Storage.get({key: 'items'});
        
        if(itemsSaved.value){
            const parsedItems = JSON.parse( itemsSaved.value);
            dispatch({ type: FETCH_ITEMS_SUCCEEDED, payload: { items: parsedItems } });
            dispatch({ type: LOCAL_STORAGE});
        }
        else{
          dispatch({ type: FETCH_ITEMS_FAILED, payload: { error } });
        }
      }
    }
  }

  async function saveItemCallback(item: ItemProps, items: ItemProps[]) {
    try {
      dispatch({ type: SAVE_ITEM_STARTED });
      let savedItem;  
      
      if(item.id && items && + item.id === -1){
        savedItem = await createItem(token, item)
      }
      else{
        
        savedItem = await updateItem(token, item)
      }
      dispatch({ type: SAVE_ITEM_SUCCEEDED, payload: { item: savedItem} });
    } catch (error) {
      dispatch({ type: SAVE_ITEM_FAILED, payload: { error } });
    }
  }

  function wsEffect() {
    let canceled = false;
    let closeWebSocket: () => void;
    if (token?.trim()) {
      closeWebSocket = newWebSocket(token, message => {
        if (canceled) {
          return;
        }
        const { type, payload: item } = message;
        if (type === 'created' || type === 'updated') {
          dispatch({ type: SAVE_ITEM_SUCCEEDED, payload: { item } });
        }
      });
    }
    return () => {
      canceled = true;
      closeWebSocket?.();
    }
  }
};
