import React, { useCallback, useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
import { ProductProps } from './ProductProps';
import { createItem, getItems, newWebSocket, updateItem } from './ProductApi';

type SaveItemFn = (item: ProductProps, items: ProductProps[]) => Promise<any>;

export interface ItemsState {
  items?: ProductProps[],
  fetching: boolean,
  fetchingError?: Error | null,
  saving: boolean,
  savingError?: Error | null,
  saveItem?: SaveItemFn,
}

interface ActionProps {
  type: string,
  payload?: any,
}

const initialState: ItemsState = {
  fetching: false,
  saving: false,
};

const FETCH_ITEMS_STARTED = 'FETCH_ITEMS_STARTED';
const FETCH_ITEMS_SUCCEEDED = 'FETCH_ITEMS_SUCCEEDED';
const FETCH_ITEMS_FAILED = 'FETCH_ITEMS_FAILED';
const SAVE_ITEM_STARTED = 'SAVE_ITEM_STARTED';
const SAVE_ITEM_SUCCEEDED = 'SAVE_ITEM_SUCCEEDED';
const SAVE_ITEM_FAILED = 'SAVE_ITEM_FAILED';

const reducer: (state: ItemsState, action: ActionProps) => ItemsState =
  (state, { type, payload }) => {
    switch (type) {
      case FETCH_ITEMS_STARTED:
        return { ...state, fetching: true, fetchingError: null };
      case FETCH_ITEMS_SUCCEEDED:
        return { ...state, items: payload.items, fetching: false };
      case FETCH_ITEMS_FAILED:
        return { ...state, fetchingError: payload.error, fetching: false };
      case SAVE_ITEM_STARTED:
        return { ...state, savingError: null, saving: true };
      case SAVE_ITEM_SUCCEEDED:
        const items = [...(state.items || [])];
        const item = payload.item;
        const index = items.findIndex(it => it.id === item.id);
        
        if (index === -1) {
          items.splice(0, 0, item);
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
  const [state, dispatch] = useReducer(reducer, initialState);
  const { items, fetching, fetchingError, saving, savingError } = state;
  useEffect(getItemsEffect, []);
  useEffect(wsEffect, []);
  const saveItem = useCallback<SaveItemFn>(saveItemCallback, []);
  const value = { items, fetching, fetchingError, saving, savingError, saveItem };
  
  return (
    <ItemContext.Provider value={value}>
      {children}
    </ItemContext.Provider>
  );

  function getItemsEffect() {
    let canceled = false;
    fetchItems();
    return () => {
      canceled = true;
    }

    async function fetchItems() {
      try {
        dispatch({ type: FETCH_ITEMS_STARTED });
        const items = await getItems();
        if (!canceled) {
          dispatch({ type: FETCH_ITEMS_SUCCEEDED, payload: { items } });
        }
      } catch (error) {
        dispatch({ type: FETCH_ITEMS_FAILED, payload: { error } });
      }
    }
  }

  async function saveItemCallback(item: ProductProps, items: ProductProps[]) {
    try {
      dispatch({ type: SAVE_ITEM_STARTED });
      let savedItem;  
      
      if(item.id && items && +item.id === items.length + 1){
        savedItem = await createItem(item)
      }
      else{
        
        savedItem = await updateItem(item)
      }
      dispatch({ type: SAVE_ITEM_SUCCEEDED, payload: { item: savedItem} });
    } catch (error) {
      dispatch({ type: SAVE_ITEM_FAILED, payload: { error } });
    }
  }

  function wsEffect() {
    let canceled = false;
    const closeWebSocket = newWebSocket(message => {
      if (canceled) {
        return;
      }
      const { event, payload: { item }} = message;
      if (event === 'created' || event === 'updated') {
        dispatch({ type: SAVE_ITEM_SUCCEEDED, payload: { item } });
      }
    });
    return () => {
      canceled = true;
      closeWebSocket();
    }
  }
};
