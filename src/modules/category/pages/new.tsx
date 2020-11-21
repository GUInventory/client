import { Button, FormControl, FormLabel, Input, useToast } from '@chakra-ui/react'
import React from 'react'
import { useForm } from 'react-hook-form'

import { Layout, LoadingScreen, Breadcrumb, ErrorPage } from '@modules/core/components'

type Inputs = {
  name: string
  color: string
}

export const NewCategory = () => {
  const { register, handleSubmit, errors } = useForm<Inputs>()
  const toast = useToast()

  const onSubmit = async (inputData) => {
    alert('submit')
    console.table(inputData)
  }

  return (
    <Layout>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl mb={4}>
          <FormLabel htmlFor="title">Title</FormLabel>
          <Input name="title" type="text" ref={register} />
        </FormControl>

        <FormControl mb={4}>
          <FormLabel htmlFor="color">Color</FormLabel>
          <Input name="color" type="color" ref={register} />
        </FormControl>

        <Button colorScheme="blue" type="submit">
          Create
        </Button>
      </form>
    </Layout>
  )
}
