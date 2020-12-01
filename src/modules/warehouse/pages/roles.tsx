import {
  Heading,
  Flex,
  Text,
  Select,
  ButtonGroup,
  IconButton,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Box,
} from '@chakra-ui/react'
import React, { useState } from 'react'
import { Breadcrumb, LoadingScreen, ErrorPage } from '@modules/core/components'
import { useListRolesQuery, ListRolesDocument } from '../graphql/list_roles.generated'
import { useRouter } from 'next/router'
import { DeleteIcon } from '@chakra-ui/icons'
import { AuthContext } from '@modules/core/providers/auth_provider'
import { useForm } from 'react-hook-form'
import { useDeleteRoleMutation } from '../graphql/delete_role.generated'
import { useUpdateRoleMutation } from '../graphql/update_role.generated'
import { useCreateRoleMutation } from '../graphql/create_role.generated'
import { useListUsersQuery } from '../graphql/list_users.generated'
import { ListMyWarehousesDocument } from '../graphql/list.generated'

type Inputs = {
  roleType: string
  userId: string
}

export const EditWarehouseRoles = () => {
  const router = useRouter()
  const { data, loading, error } = useListRolesQuery({
    variables: { id: +router.query.warehouse_id },
  })
  const userQuery = useListUsersQuery()
  const [state, setState] = useState<{ id: number; roleType: string }[]>([])
  const { register, handleSubmit, errors, reset } = useForm<Inputs>()
  const [createRoleMutation, createState] = useCreateRoleMutation()
  const [deleteRoleMutation, deleteState] = useDeleteRoleMutation()
  const [updateRoleMutation, updateState] = useUpdateRoleMutation()

  const onSubmit = async (inputData) => {
    await createRoleMutation({
      variables: {
        roleType: inputData.roleType,
        userId: +inputData.userId,
        warehouseId: +router.query.warehouse_id,
      },
      refetchQueries: [
        { query: ListMyWarehousesDocument },
        { query: ListRolesDocument, variables: { id: +router.query.warehouse_id } },
      ],
    })
    reset()
  }

  if (userQuery.loading || loading) return <LoadingScreen />
  if (userQuery.error || error) return <ErrorPage />

  const onDeleteClick = async (id) => {
    await deleteRoleMutation({
      variables: { id },
      refetchQueries: [
        { query: ListMyWarehousesDocument },
        { query: ListRolesDocument, variables: { id: +router.query.warehouse_id } },
      ],
    })
  }

  const onUpdateClick = async (id, roleType) => {
    await updateRoleMutation({
      variables: { id, roleType },
      refetchQueries: [
        { query: ListMyWarehousesDocument },
        { query: ListRolesDocument, variables: { id: +router.query.warehouse_id } },
      ],
    })
  }

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
            title: 'Edit roles',
          },
        ]}
      />

      <Heading>Roles</Heading>
      <Box mb={5}>
        <Box>
          <Text fontWeight="bold">Admin</Text>Can edit warehouse, storages and items and manage
          roles
        </Box>
        <Box>
          <Text fontWeight="bold">Editor</Text>Can edit warehouse, storages and items
        </Box>
        <Box>
          <Text fontWeight="bold">User</Text>Only view access
        </Box>
      </Box>
      <Heading>Add new user</Heading>

      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl mb={4} isInvalid={!!errors.userId}>
          <FormLabel htmlFor="userId">User</FormLabel>
          <Select ref={register} name="userId" placeholder="Select user">
            {userQuery?.data?.users?.map((user) => (
              <option value={user.id}>{user.name}</option>
            ))}
          </Select>
          <FormErrorMessage>{errors.userId?.message}</FormErrorMessage>
        </FormControl>

        <FormControl mb={4} isInvalid={!!errors.roleType}>
          <FormLabel htmlFor="roleType">Role type</FormLabel>
          <Select ref={register} name="roleType" placeholder="Select role type">
            <option value="USER">User</option>
            <option value="EDITOR">Editor</option>
            <option value="ADMIN">Admin</option>
          </Select>
          <FormErrorMessage>{errors.roleType?.message}</FormErrorMessage>
        </FormControl>

        <Button colorScheme="blue" type="submit" isLoading={createState.loading}>
          Create
        </Button>
      </form>

      <Heading mt={5}>Roles</Heading>
      <Flex direction="column" mt={4}>
        {data?.roles?.map((role) => (
          <Flex key={role.id} w="100%" mb={2} borderBottom="1px" p={2} borderColor="gray.300">
            <AuthContext.Consumer>
              {(user) => (
                <>
                  <Text flex={3}>{role.user.name}</Text>
                  <Text flex={1}>{role.roleType}</Text>
                  <ButtonGroup size="sm" isAttached mt={1} flex={2}>
                    {user.id != role.user.id && (
                      <>
                        {role.roleType != 'USER' && (
                          <Button
                            colorScheme="blue"
                            onClick={() => onUpdateClick(+role.id, 'USER')}
                          >
                            make user
                          </Button>
                        )}
                        {role.roleType != 'EDITOR' && (
                          <Button
                            colorScheme="blue"
                            onClick={() => onUpdateClick(+role.id, 'EDITOR')}
                          >
                            make editor
                          </Button>
                        )}
                        {role.roleType != 'ADMIN' && (
                          <Button
                            colorScheme="blue"
                            onClick={() => onUpdateClick(+role.id, 'ADMIN')}
                          >
                            make admin
                          </Button>
                        )}
                        {user.id != role.user.id && (
                          <>
                            <IconButton
                              colorScheme="red"
                              aria-label="Delete"
                              icon={<DeleteIcon />}
                              onClick={() => onDeleteClick(+role.id)}
                            />
                          </>
                        )}
                      </>
                    )}
                  </ButtonGroup>
                </>
              )}
            </AuthContext.Consumer>
          </Flex>
        ))}
      </Flex>
    </>
  )
}
