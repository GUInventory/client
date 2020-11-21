import { Heading } from '@chakra-ui/react'
import React from 'react'
import { useRouter } from 'next/router'
import { Layout, LoadingScreen, Breadcrumb, ErrorPage } from '@modules/core/components'
import { useCategoryQuery } from '../graphql/find.generated'

export const Category = () => {
  const router = useRouter()
  const { data, loading, error } = useCategoryQuery({ variables: { id: +router.query.id } })

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
      <Heading mb={5}>{data.category.name}</Heading>
    </Layout>
  )
}
