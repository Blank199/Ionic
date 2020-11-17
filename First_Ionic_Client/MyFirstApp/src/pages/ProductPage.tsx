import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React, { useState } from 'react';
import ExploreContainer from '../components/ExploreContainer';
import { DetaliatedProduct, IProduct } from '../components/Product';
import { getOneProduct } from '../ProductService/ProductApi';



const ProductPage: React.FC = () => {
let result: IProduct = {id:"",name:"",price:"",stock:""};

    async function getFromPromise (){
        var url = window.location.pathname;
        var id = url.substring(url.lastIndexOf('/') + 1);   
        const res = await getOneProduct(id);
        setProduct(res);
      }

    getFromPromise();

    const [product, setProduct] = useState(
    result
    )

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Product Page</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Product Page</IonTitle>
          </IonToolbar>
        </IonHeader>
        <ExploreContainer />
        <DetaliatedProduct id={product.id} name={product.name} price={product.price} stock={product.stock}></DetaliatedProduct>
      </IonContent>
    </IonPage>
  );
};

export default ProductPage;
