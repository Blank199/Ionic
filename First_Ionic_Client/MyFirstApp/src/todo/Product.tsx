import React, { useEffect, useState } from 'react';
import { IonImg, IonItem, IonLabel } from '@ionic/react';
import { ItemProps } from './ProductProps';

interface ItemPropsExt extends ItemProps {
  onEdit: (id?: string) => void;
}

const Item: React.FC<ItemPropsExt> = ({ id, name, imgName, onEdit }) => {
  const [stateImgName, setStateImgName] = useState("");

  const wraper = () => {
    const getDataFromPromise = async () => {
      setStateImgName(await imgName!);
    }
    getDataFromPromise();
  }

  useEffect(wraper,[]);

  return (
    <div>
      <IonItem onClick={() => onEdit(id)}>
      <IonLabel>{name}</IonLabel>
    </IonItem>
    <IonImg className={"img"} src = {stateImgName? stateImgName:""}/>
    </div>
  );
};

export default Item;
