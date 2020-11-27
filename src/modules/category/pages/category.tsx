import { Flex, Heading, Box, IconButton, ButtonGroup } from '@chakra-ui/react'
import React from 'react'
import { useRouter } from 'next/router'
import NextLink from 'next/link'
import { LoadingScreen, Breadcrumb, ErrorPage } from '@modules/core/components'
import { useCategoryQuery } from '../graphql/find.generated'
import { useDeleteCategoryMutation } from '../graphql/delete.generated'
import { EditIcon, DeleteIcon } from '@chakra-ui/icons'
import { ListCategoriesDocument } from '../graphql/list.generated'

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
    await deleteCategoryMutation({
      variables: { id },
      refetchQueries: [{ query: ListCategoriesDocument }],
    })

    router.push('/category')
  }

  return (
    <>
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
          <ButtonGroup size="sm" isAttached mt={1}>
            <NextLink href={`/category/${data.category.id}/edit`}>
              <IconButton colorScheme="blue" aria-label="Edit" icon={<EditIcon />} />
            </NextLink>
            <IconButton
              colorScheme="red"
              aria-label="Delete"
              icon={<DeleteIcon />}
              onClick={onDeleteClick}
            />
          </ButtonGroup>
        </Box>
      </Flex>
    </>
  )
}
