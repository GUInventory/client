import React from 'react'
import { Button, Heading, Flex } from '@chakra-ui/react'
import NextLink from 'next/link'
import { Layout, LoadingScreen, Breadcrumb, ErrorPage } from '@modules/core/components'
import { useListCategoriesQuery } from '../graphql/list.generated'
import { CategoryElement } from '../components'

export const Categories = () => {
  const { data, loading, error } = useListCategoriesQuery()

  if (error) {
    return <ErrorPage />
  }
  if (loading) {
    return <LoadingScreen />
  }

  return (
    <Layout>
      <Breadcrumb
        data={[
          {
            href: '#',
            isCurrentPage: true,
            title: 'Categories',
          },
        ]}
      />
      <Flex justifyContent="space-between">
        <Heading>Categories</Heading>

        <NextLink href="/category/new">
          <Button colorScheme="blue">Add new category</Button>
        </NextLink>
      </Flex>
      {data.categories.map((category) => (
        <CategoryElement
          id={category.id}
          name={category.name}
          color={category.color}
          numberOfItems={category.items?.length || 0}
        />
      ))}
    </Layout>
  )
}
