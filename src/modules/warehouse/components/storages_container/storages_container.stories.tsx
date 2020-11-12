import React from 'react'
import { StoragesContainer } from './storages_container'

export default {
  title: 'Warehouse/StoragesContainer',
}

const data = [
  {
    id: '1',
    name: 'Storage A',
  },
  {
    id: '2',
    name: 'Storage B',
  },
  {
    id: '3',
    name: 'Storage C',
  },
]
export const container = () => <StoragesContainer storages={data} />
