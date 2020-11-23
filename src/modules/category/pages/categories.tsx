import React from 'react'
import { Heading, Flex, IconButton } from '@chakra-ui/react'
import NextLink from 'next/link'
import { Layout, LoadingScreen, Breadcrumb, ErrorPage } from '@modules/core/components'
import { useListCategoriesQuery } from '../graphql/list.generated'
import { CategoryElement } from '../components'
import { useDeleteCategoryMutation } from '../graphql/delete.generated'
import { AddIcon } from '@chakra-ui/icons'

export const Categories = () => {
  const { data, loading, error } = useListCategoriesQuery()
  const [deleteCategoryMutation, deleteState] = useDeleteCategoryMutation()

  if (error) {
    return <ErrorPage />
  }
  if (loading) {
    return <LoadingScreen />
  }

  const onDeleteClick = async (id) => {
    await deleteCategoryMutation({ variables: { id } })
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
          <IconButton colorScheme="blue" aria-label="Add new category" icon={<AddIcon />} />
        </NextLink>
      </Flex>
      {data.categories.map((category) => (
        <CategoryElement
          id={category.id}
          name={category.name}
          color={category.color}
          numberOfItems={category.items?.length || 0}
          onDeleteClick={() => onDeleteClick(+category.id)}
        />
      ))}
    </Layout>
  )
}
