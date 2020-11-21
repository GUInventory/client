import { Button, Flex, Heading, Box } from '@chakra-ui/react'
import React from 'react'
import { useRouter } from 'next/router'
import { Layout, LoadingScreen, Breadcrumb, ErrorPage } from '@modules/core/components'
import { useCategoryQuery } from '../graphql/find.generated'
import { useDeleteCategoryMutation } from '../graphql/delete.generated'

export const Category = () => {
  const router = useRouter()
  const { data, loading, error } = useCategoryQuery({ variables: { id: +router.query.id } })
  const [deleteCategoryMutation, deleteState] = useDeleteCategoryMutation()

  if (error) {
    return <ErrorPage />
  }
  if (loading) {
    return <LoadingScreen />
  }

  const onDeleteClick = async (id) => {
    await deleteCategoryMutation({ variables: { id } })

    router.push('/category')
  }

  return (
    <Layout>
      <Breadcrumb
        data={[
          {
            href: '/category',
            title: 'Categories',
          },
          {
            href: '#',
            isCurrentPage: true,
            title: data.category.name,
          },
        ]}
      />
      <Flex justifyContent="space-between">
        <Heading>{data.category.name}</Heading>

        <Box>
          <Button colorScheme="blue">Edit</Button>
          <Button
            colorScheme="red"
            isLoading={deleteState.loading}
            onClick={() => onDeleteClick(+data.category.id)}
          >
            Delete
          </Button>
        </Box>
      </Flex>
    </Layout>
  )
}
