import React from 'react'
import { ItemListElementProps, ItemListElement } from './item_list_element'

type ItemListProps = { warehouseId: string; storageId: string; items: ItemListElementProps[] }
export const ItemList = ({ warehouseId, storageId, items }: ItemListProps) => (
  <>
    {items.map((item) => (
      <ItemListElement {...item} warehouseId={warehouseId} storageId={storageId} />
    ))}
  </>
)
