import axios from 'axios';
import { getLogger } from '../core';
import { ItemProps } from './ProductProps';

const log = getLogger('itemApi');

const baseUrl = 'localhost:5000/api/v1';
const itemUrl = `http://${baseUrl}/products`;


const config = {
  headers: {
    'Content-Type': 'application/json'
  }
};

export const getItems: () => Promise<ItemProps[]> = () => {
  return axios
        .get(`${itemUrl}`, config)
        .then(res => {
            return Promise.resolve(res.data);
        })
        .catch(error => {
            return Promise.reject(error);
        });
}

export const createItem: (item: ItemProps) => Promise<ItemProps[]> = item => {
  return axios
  .post(`${itemUrl}`,item, config)
  .then(res => {
      return Promise.resolve(res.data);
  })
  .catch(error => {
      return Promise.reject(error);
  });
}

export const updateItem: (item: ItemProps) => Promise<ItemProps[]> = item => {
  return axios
  .put(`${itemUrl}`,item, config)
  .then(res => {
      return Promise.resolve(res.data);
  })
  .catch(error => {
      return Promise.reject(error);
  });
}

interface MessageData {
  event: string;
  payload: {
    item: ItemProps;
  };
}

export const newWebSocket = (onMessage: (data: MessageData) => void) => {
  const ws = new WebSocket(`ws://${baseUrl}/products`)
  ws.onopen = () => {
    log('web socket onopen');
  };
  ws.onclose = () => {
    log('web socket onclose');
  };
  ws.onerror = error => {
    log('web socket onerror', error);
  };
  ws.onmessage = messageEvent => {
    log('web socket onmessage');
    onMessage(JSON.parse(messageEvent.data));
  };
  return () => {
    ws.close();
  }
}
