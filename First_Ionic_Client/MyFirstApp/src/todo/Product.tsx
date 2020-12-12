import React from 'react';
import { IonItem, IonLabel } from '@ionic/react';
import { ProductProps } from './ProductProps';

interface ItemPropsExt extends ProductProps {
  onEdit: (id?: string) => void;
}

const Item: React.FC<ItemPropsExt> = ({ id, name, onEdit }) => {
  return (
    <IonItem onClick={() => onEdit(id)}>
      <IonLabel>{name}</IonLabel>
    </IonItem>
  );
};

export default Item;
