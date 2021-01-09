import React, { useContext, useEffect, useState } from 'react';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonImg,
  IonInput,
  IonLabel,
  IonLoading,
  IonPage,
  IonTitle,
  IonToolbar
} from '@ionic/react';
import { ItemContext } from './ProductProvider';
import { RouteComponentProps } from 'react-router';
import { ItemProps } from './ProductProps';

import './Product.css';
import { usePhotoGallery } from './usePhotoGallery';
import { camera } from 'ionicons/icons';
//import { useMyLocation } from './useMyLocation';
import { MyMap } from './MyMap';



interface ItemEditProps extends RouteComponentProps<{
  id?: string;
}> {}

const ItemEdit: React.FC<ItemEditProps> = ({ history, match }) => {
  const { items, saving, savingError, saveItem } = useContext(ItemContext);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [item, setItem] = useState<ItemProps>();
  const [latitude, setLatitude] = useState<number | undefined>(44.87549767121354);
  const [longitude, setLongitude] = useState<number | undefined>(24.841699598127455);
  const {takePhoto, currentPhotoName, currentPhotoWebPath, setCurrentPhotoWebPath, getPhotoByName, setCurrentPhotoName} = usePhotoGallery();

  //const myLocation = useMyLocation();
  // const { latitude: lat, longitude: lng } = myLocation.position?.coords || {}

  useEffect(() => {
    const routeId = match.params.id || '';
    const item = items?.find(it => it.id?.toString() === routeId);
    setItem(item);
    if (item) {
      setName(item.name);
      setPrice(item.price);
      setStock(item.stock);
      if(typeof item.imgName === 'string'){
        setCurrentPhotoName(item.imgName);
      }
      setLatitude(item.latitude);
      setLongitude(item.longitude);
    }

    const setWebPath = async () => {
      if(item && item.imgName)
      {
        setCurrentPhotoWebPath(await getPhotoByName(item.imgName));
      }
    } 

    setWebPath();

  }, [match.params.id, items]);
  const handleSave = () => {
    let newId: string = '-1';
    const editedItem = item ? { ...item, name, price, stock, imgName:currentPhotoName, latitude:latitude, longitude:longitude } : {id:newId, name:name, price:price, stock:stock, imgName:currentPhotoName, latitude:latitude, longitude:longitude };
    saveItem && saveItem(editedItem, items || []).then(() => history.goBack());
  };
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Edit</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={handleSave}>
              Save
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonLabel>Name:</IonLabel>
        <IonInput value={name} onIonChange={e => setName(e.detail.value || '')} />
        <IonLabel>Price:</IonLabel>
        <IonInput value={price} onIonChange={e => setPrice(e.detail.value || '')} />
        <IonLabel>Stock:</IonLabel>
        <IonInput value={stock} onIonChange={e => setStock(e.detail.value || '')} />
        <IonImg className="img" src = {currentPhotoWebPath}></IonImg>
        <MyMap
            lat={latitude}
            lng={longitude}
            onMapClick={log('onMap')}
            onMarkerClick={log('onMarker')}
        />
        <IonFab vertical="bottom" horizontal="center" slot="fixed">
          <IonFabButton  onClick={() => takePhoto()}>
              <IonIcon icon={camera}/>
          </IonFabButton >
        </IonFab>
        <IonLoading isOpen={saving} />
        {savingError && (
          <div>{savingError.message || 'Failed to save item'}</div>
        )}
      </IonContent>
    </IonPage>
  );
  function log(source: string) {
    return (l: any) => {
        console.log(source,l.latLng.lat(), l.latLng.lng());
        setLatitude(l.latLng.lat());
        setLongitude(l.latLng.lng());
        return l};
}
};

export default ItemEdit;
