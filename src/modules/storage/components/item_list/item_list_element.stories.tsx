import React from 'react'
import { ItemListElement } from './item_list_element'

export default {
  title: 'Warehouse/ItemListElement',
}

export const listElement = () => (
  <ItemListElement
    id={1}
    warehouseId="1"
    storageId="1"
    image="https://placehold.it/60x60"
    name="Item name"
    value={4500}
  />
)
