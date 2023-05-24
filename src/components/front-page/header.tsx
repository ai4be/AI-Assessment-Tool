import checkEnvironment from '@/util/check-environment'
import { Box, Text, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Spacer, Flex } from '@chakra-ui/react'

const AI4BelgiumIcon = (): JSX.Element => (
  <Box className='px-3 py-5 flex flex-col justify-center font-semibold text-lg cursor-pointer'>
    <Text color='white' fontSize='lg'> AI<Text as='sub' className='icon-blue-color'>4</Text>Belgium</Text>
  </Box>
)

export const AI4BelgiumHeader = (): JSX.Element => {
  const url = `${checkEnvironment()}/login`
  return (
    <Box width='100%'>
      <Flex width='100%' alignItems='center' gap='2' p='2' bgColor='rgba(14,16,18)'>
        <AI4BelgiumIcon />
        <Spacer />
        <Breadcrumb color='white' opacity='0.75' px='3' py='5' fontWeight='medium' fontSize='lg'>
          <BreadcrumbItem>
            <BreadcrumbLink href='https://github.com/AI4Belgium/AI-Assessment-Tool'>Source</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink href={url}>Demo</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
      </Flex>
    </Box>
  )
}
