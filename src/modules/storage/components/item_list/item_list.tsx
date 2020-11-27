import React from 'react'
import { ItemListElementProps, ItemListElement } from './item_list_element'

type ItemListProps = { items: ItemListElementProps[] }
export const ItemList = ({ items }: ItemListProps) => (
  <>
    {items.map((item) => (
      <ItemListElement {...item} />
    ))}
  </>
)
