import React, { useContext, useEffect, useState } from 'react';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonInput,
  IonLoading,
  IonPage,
  IonTitle,
  IonToolbar
} from '@ionic/react';
import { ItemContext } from './ProductProvider';
import { RouteComponentProps } from 'react-router';
import { ItemProps } from './ProductProps';



interface ItemEditProps extends RouteComponentProps<{
  id?: string;
}> {}

const ItemEdit: React.FC<ItemEditProps> = ({ history, match }) => {
  const { items, saving, savingError, saveItem } = useContext(ItemContext);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [item, setItem] = useState<ItemProps>();
  useEffect(() => {
    const routeId = match.params.id || '';
    const item = items?.find(it => it.id?.toString() === routeId);
    setItem(item);
    if (item) {
      setName(item.name);
      setPrice(item.price);
      setStock(item.stock);
    }
  }, [match.params.id, items]);
  const handleSave = () => {
    let newId: string = '0';
    if(items?.length){
      newId = (items?.length + 1).toString()
    }
    const editedItem = item ? { ...item, name, price, stock } : {id:newId, name:name, price:price, stock:stock };
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
        <IonInput value={name} onIonChange={e => setName(e.detail.value || '')} />
        <IonInput value={price} onIonChange={e => setPrice(e.detail.value || '')} />
        <IonInput value={stock} onIonChange={e => setStock(e.detail.value || '')} />
        <IonLoading isOpen={saving} />
        {savingError && (
          <div>{savingError.message || 'Failed to save item'}</div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default ItemEdit;
