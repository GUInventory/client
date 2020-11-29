import { Heading } from '@chakra-ui/react'
import React from 'react'
import { Breadcrumb } from '@modules/core/components'

export const EditWarehouseRoles = () => {
  return (
    <>
      <Breadcrumb
        data={[
          {
            href: '/',
            title: 'Warehouses',
          },
          {
            href: '#',
            isCurrentPage: true,
            title: 'New',
          },
        ]}
      />
      <Heading>Manage warehouse roles</Heading>
    </>
  )
}
