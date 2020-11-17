import Axios from 'axios'
import { IProduct } from '../components/Product';

const baseUrl = 'http://127.0.0.1:5000/api/v1';

export const getAllProducts: () => Promise<IProduct[]> = () => {
  return Axios
    .get(`${baseUrl}/products`)
    .then(res => {
      return Promise.resolve(res.data);
    })
    .catch(err => {
      return Promise.reject(err);
    });
}

export const getOneProduct: (id: string) => Promise<IProduct> = (id: string) => {
  return Axios
    .get(`${baseUrl}/products/${id}`)
    .then(res => {
      return Promise.resolve(res.data);
    })
    .catch(err => {
      return Promise.reject(err);
    });
}