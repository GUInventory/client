import React from 'react'
import { ItemListElement } from './item_list_element'

export default {
  title: 'Warehouse/ItemListElement',
}

export const listElement = () => (
  <ItemListElement image="https://placehold.it/60x60" name="Item name" value={4500} />
)
