import React from 'react'
import {
  Code,
  Heading,
  Box,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Flex,
  Text,
} from '@chakra-ui/react'
import { Layout, LoadingScreen, Breadcrumb, ErrorPage } from '@modules/core/components'
import { useListLogsQuery } from '../graphql/list.generated'

export const Logs = () => {
  const { data, loading, error } = useListLogsQuery()

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
            title: 'Logs',
          },
        ]}
      />
      <Heading>Logs</Heading>

      <Accordion my={4}>
        {data.logs.map((log) => (
          <AccordionItem key={log.id}>
            <AccordionButton>
              <Box flex="1" textAlign="left">
                {log.entityName}#{log.entityId} {log.type} by {log.user.name} at {log.createdAt}
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4}>
              <Flex w="100%">
                <Box flex="1">
                  <Text fontWeight="bold">Old value</Text>
                  {JSON.stringify(log.oldValues)}
                </Box>
                <Box flex="1">
                  <Text fontWeight="bold">New value</Text>
                  <Code>{JSON.stringify(log.newValues)}</Code>
                </Box>
              </Flex>
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
    </Layout>
  )
}
