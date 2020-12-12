import axios from 'axios';
import { ProductProps } from './ProductProps';
import { io } from 'socket.io-client';

const baseUrl = 'localhost:5000/api/v1';
const itemUrl = `http://${baseUrl}/products`;


const config = {
  headers: {
    'Content-Type': 'application/json'
  }
};

export const getItems: () => Promise<ProductProps[]> = () => {
  return axios
        .get(`${itemUrl}`, config)
        .then(res => {
            return Promise.resolve(res.data);
        })
        .catch(error => {
            return Promise.reject(error);
        });
}

export const createItem: (item: ProductProps) => Promise<ProductProps[]> = item => {
  return axios
  .post(`${itemUrl}`,item, config)
  .then(res => {
      return Promise.resolve(res.data);
  })
  .catch(error => {
      return Promise.reject(error);
  });
}

export const updateItem: (item: ProductProps) => Promise<ProductProps[]> = item => {
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
    item: ProductProps;
  };
}


export const newWebSocket = (onmessage: (data: MessageData) => void) => {
  const socket = io('ws://localhost:5000/api/v1');

  socket.on('connected', () => {
      console.info("socketio connected");
  });

  return () => {
      socket.close();
  }
}
