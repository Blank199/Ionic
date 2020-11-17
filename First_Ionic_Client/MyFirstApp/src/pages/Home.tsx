import { IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React, { useState } from 'react';
import ExploreContainer from '../components/ExploreContainer';
import ListProduct, { DetaliatedProduct, IProduct } from '../components/Product';
import { add } from 'ionicons/icons';

import {useItems} from '../ProductService/ProductService'

import './Home.css';
import { getAllProducts } from '../ProductService/ProductApi';



/*const Home: React.FC = () => {
  const [products, setProduct] = useState([{
    id: "1",
    name: "Lapte",
    price: "10",
    stock:"100"
  },
  {
    id: "2",
    name: "Oua",
    price: "1",
    stock:"1000"
  }
])
*/
const Home: React.FC = () => {
  let resultes: any[] = [];

  async function getFromPromise (){
    const res = await getAllProducts();
    setProduct(res);    
  }

  getFromPromise();
  
  
  const [products, setProduct] = useState(
    resultes
  )

  const addBtn = () => {
    const id = products.length + 1;
    const name = `Produsul ${id}`;
    const price = 10 * +id;
    const stock = 100 * +id;
    setProduct(products.concat({
      id:id.toString(),
      name: name,
      price: price.toString(),
      stock: stock.toString()
    }))
}

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Chris Project</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Chris Project</IonTitle>
          </IonToolbar>
        </IonHeader>
        <ExploreContainer />
        {products.map(({ id, name,price, stock}) => <ListProduct key = {id} id = {id} name = {name} price = {price} stock = {stock}/>)}
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick = {addBtn}>
              <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default Home;
