import React, { useContext, useState } from 'react';
import { RouteComponentProps } from 'react-router';
import {
  IonButton,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonList, IonLoading,
  IonPage,
  IonSearchbar,
  IonTitle,
  IonToolbar
} from '@ionic/react';
import { add, warning, wifi } from 'ionicons/icons';
import Item from './Product';
import { ItemContext } from './ProductProvider';
import { AuthContext } from '../Authentication/AuthProvider';
import { usePhotoGallery } from './usePhotoGallery';
//import { useNetwork } from './UseNetwork';



const ItemList: React.FC<RouteComponentProps> = ({ history }) => {
  const { items, fetching, fetchingError, disableInfiniteScroll, searchNext } = useContext(ItemContext);
  const[searchItem, setSearchItem] = useState<string>('');
  const{logout} = useContext(AuthContext);
  //const { networkStatus } = useNetwork();

  const {getPhotoByName} = usePhotoGallery();

  const handleLogout = () =>{
    logout?.();
  } 

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>My App</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div>{`connected: ${JSON.stringify(!disableInfiniteScroll)}`}</div>
        <IonButton onClick={handleLogout}>Logout</IonButton>
        <IonLoading isOpen={fetching} message="Fetching items" />
        <IonSearchbar value = {searchItem} debounce = {500} onIonChange = {e => setSearchItem(e.detail.value!)} ></IonSearchbar>
        {items && (
          <IonList>
            {items.filter(({name}) => (name.indexOf(searchItem) >= 0))
            .map(({ id, name, imgName}) =>
              <Item key={id} id={id} name={name} price={''} stock={''} imgName={getPhotoByName(imgName!)} onEdit={id => history.push(`/products/${id}`)} />)}
          </IonList>
        )}
        {fetchingError && (
          <div>{fetchingError.message || 'Failed to fetch items'}</div>
        )}
        <IonInfiniteScroll threshold="100px" disabled={disableInfiniteScroll}
            onIonInfinite={(e: CustomEvent<void>) => searchNext?.(e, items)}>
            <IonInfiniteScrollContent
                loadingText="Loading more good doggos...">
            </IonInfiniteScrollContent>
        </IonInfiniteScroll>
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={() => history.push('/product')}>
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>

        <IonFab vertical="top" horizontal="center" slot="fixed">
            <IonFabButton disabled={true} color="primary">
                <IonIcon icon={disableInfiniteScroll ? warning : wifi}></IonIcon>
            </IonFabButton>
        </IonFab>

      </IonContent>
    </IonPage>
  );
};

export default ItemList;
