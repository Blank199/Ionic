import { IonItem, IonLabel } from '@ionic/react';
import React from 'react';

 export interface IProduct{
    id?: string;
    name: string;
    price: string;
    stock: string;
}
let URL: string= "http://localhost:8100/home/";

const ListProduct: React.FC<IProduct> = ({id, name, price, stock}) => {
    const redirectTo = URL + id 
    return (
        <a href= {redirectTo}>
            <IonItem>
                <IonLabel>
                    {name}
                </IonLabel>
            </IonItem>
        </a>
    );
};

export const DetaliatedProduct:React.FC<IProduct> = ({id, name, price, stock}) => {
    return(
        <IonItem>
            <IonLabel>
            {id} 
            </IonLabel>
            <IonLabel>
            {name} 
            </IonLabel>
            <IonLabel>
            {price} 
            </IonLabel>
            <IonLabel>
            {stock} 
            </IonLabel>
            
        </IonItem>
    );
};


export default ListProduct;


