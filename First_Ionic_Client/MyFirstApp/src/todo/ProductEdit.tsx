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



interface ItemEditProps extends RouteComponentProps<{
  id?: string;
}> {}

const ItemEdit: React.FC<ItemEditProps> = ({ history, match }) => {
  const { items, saving, savingError, saveItem } = useContext(ItemContext);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [item, setItem] = useState<ItemProps>();
  const {takePhoto, currentPhotoName, currentPhotoWebPath, setCurrentPhotoWebPath, getPhotoByName} = usePhotoGallery();

  useEffect(() => {
    const routeId = match.params.id || '';
    const item = items?.find(it => it.id?.toString() === routeId);
    setItem(item);
    if (item) {
      setName(item.name);
      setPrice(item.price);
      setStock(item.stock);
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
    const editedItem = item ? { ...item, name, price, stock, imgName:currentPhotoName } : {id:newId, name:name, price:price, stock:stock, imgName:currentPhotoName };
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
};

export default ItemEdit;
