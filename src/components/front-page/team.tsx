import React from 'react'
import { Box, Flex, Text, Avatar, Stack, useColorModeValue, Container } from '@chakra-ui/react'

const TeamMemberAvatar = ({ src, name, title }: { src: string, name: string, title: string }): JSX.Element => {
  return (
    <Flex align='center' mt={8} direction='column'>
      <Avatar src={src} alt={name} mb={2} />
      <Stack spacing={-1} align='center'>
        <Text fontWeight={600}>{name}</Text>
        <Text fontSize='sm' color={useColorModeValue('gray.600', 'gray.400')}>
          {title}
        </Text>
      </Stack>
    </Flex>
  )
}

export const TeamMembersContainer = (): JSX.Element => {
  return (
    <Box bg={useColorModeValue('gray.100', 'gray.700')}>
      <Container maxW='7xl' py={16} as={Stack} spacing={12}>
        <Stack spacing={0} align='center'>
          <Text>Our team is composed of experts in AI ethics, data protection, technical robustness, and legal compliance.</Text>
        </Stack>
        <Stack
          direction={{ base: 'column', md: 'row' }}
          spacing={{ base: 10, md: 4, lg: 10 }}
          alignSelf='center'
        >
          <Box>
            <TeamMemberAvatar
              src='https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80'
              name='Jane Cooper'
              title='CEO at ABC Corporation'
            />
          </Box>
          <Box>
            <TeamMemberAvatar
              src='https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80'
              name='Jane Cooper'
              title='CEO at ABC Corporation'
            />
          </Box>
          <Box>
            <TeamMemberAvatar
              src='https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80'
              name='Jane Cooper'
              title='CEO at ABC Corporation'
            />
          </Box>
        </Stack>
        <Stack spacing={0} align='center'>
          <Text textAlign='center'>Together, we have developed this tool with a multidisciplinary approach, ensuring that all aspects of AI implementation are covered comprehensively.</Text>
        </Stack>
      </Container>
    </Box>
  )
}
