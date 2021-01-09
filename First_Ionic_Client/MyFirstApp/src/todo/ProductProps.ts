export interface ItemProps {
  id?: string;
  name: string;
  price: string;
  stock: string;
  imgName?: string|Promise<string>;
  latitude?: number;
  longitude?: number;
}
