import React from 'react'
import {getAllProducts} from "./ProductApi"
import {IProduct} from '../components/Product'
import { useEffect, useState } from 'react';


export interface ItemsState {
    items?: IProduct[],
    add: () => void
        
  }

export const useItems: () => ItemsState = () => {


    const add = () => {
        console.log('addItem - TODO');
      };

    let items;

    useEffect(getItemsEffect, []);
    return {
        items,
        add
    };

    function getItemsEffect() {
        let canceled = false;
        fetchItems();
        return () => {
          canceled = true;
        }

        async function fetchItems(){
            items = await getAllProducts(); 
        }

    }
}
