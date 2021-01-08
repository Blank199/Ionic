import axios from 'axios';
import { ItemProps } from './ProductProps';
import io from 'socket.io-client'; 
import { basePhoneUrl, authConfig, withLogs } from '../core';


const basePUrl = `${basePhoneUrl}/api/v1`;
const phoneUrle = `http://${basePUrl}/products`;
const localUrl = `http://localhost:5000/api/v1/products`;

export const getItems: (token: string, limit: number, page: number) => Promise<ItemProps[]> = (token, limit, page) => {
  return withLogs(axios.get(`${localUrl}/${limit}/${page}`, authConfig(token)), 'getItems');
}

export const createItem: (token: string, item: ItemProps) => Promise<ItemProps[]> = (token, item) => {
  return withLogs(axios.post(localUrl, item, authConfig(token)), 'createItem');
}

export const updateItem: (token: string, item: ItemProps) => Promise<ItemProps[]> = (token, item) => {
  console.log(item);
  return withLogs(axios.put(`${localUrl}`, item, authConfig(token)), 'updateItem');
}

interface MessageData {
  type: string;
  payload: ItemProps;
}

export const newWebSocket = (token: string, onMessage: (data: MessageData) => void) => {
  const socket = io('ws://localhost:5000');
  
  socket.on('connect', () => {
      console.log("socketio connected");
      socket.send(JSON.stringify({ type: 'authorization', payload: { token } }));
  });

  socket.on('test', () => {
    console.log("AAAAAAAAAAAAAAAAAA");
});

  return () => {
      socket.close();
  }
}