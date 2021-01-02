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
import { add } from 'ionicons/icons';
import Item from './Product';
import { ItemContext } from './ProductProvider';
import { AuthContext } from '../Authentication/AuthProvider';



const ItemList: React.FC<RouteComponentProps> = ({ history }) => {
  const { items, fetching, fetchingError, disableInfiniteScroll, searchNext } = useContext(ItemContext);
  const[searchItem, setSearchItem] = useState<string>('');
  const{logout} = useContext(AuthContext);
  
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
        <IonButton onClick={handleLogout}>Logout</IonButton>
        <IonLoading isOpen={fetching} message="Fetching items" />
        <IonSearchbar value = {searchItem} debounce = {500} onIonChange = {e => setSearchItem(e.detail.value!)} ></IonSearchbar>
        {items && (
          <IonList>
            {items.filter(({id, name, price, stock}) => (name.indexOf(searchItem) >= 0))
            .map(({ id, name}) =>
              <Item key={id} id={id} name={name} price={''} stock={''} onEdit={id => history.push(`/products/${id}`)} />)}
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
      </IonContent>
    </IonPage>
  );
};

export default ItemList;
