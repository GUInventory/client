import React from 'react'
import { Breadcrumb } from './breadcrumb'

export default {
  title: 'Core/Breadcrumb',
}

const data = [
  {
    href: '#',
    title: 'Page above this page',
  },
  {
    href: '#',
    isCurrentPage: true,
    title: 'Current page',
  },
]
export const emptyBreadcrumb = () => <Breadcrumb data={[]} />
export const breadcrumbWithData = () => <Breadcrumb data={data} />
