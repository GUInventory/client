import React from 'react'
import { Breadcrumb as ChakraBreadcrumb, BreadcrumbItem, BreadcrumbLink } from '@chakra-ui/core'
import NextLink from 'next/link'

type BreadcrumbProps = {
  data: {
    title: string
    href: string
    isCurrentPage?: boolean
  }[]
}
export const Breadcrumb = ({ data }: BreadcrumbProps) => (
  <ChakraBreadcrumb mb={3}>
    <BreadcrumbItem>
      <NextLink href="/">
        <BreadcrumbLink>Home</BreadcrumbLink>
      </NextLink>
    </BreadcrumbItem>
    {data.map((element) => (
      <BreadcrumbItem isCurrentPage={element.isCurrentPage}>
        <NextLink href={element.href}>
          <BreadcrumbLink>{element.title}</BreadcrumbLink>
        </NextLink>
      </BreadcrumbItem>
    ))}
  </ChakraBreadcrumb>
)
