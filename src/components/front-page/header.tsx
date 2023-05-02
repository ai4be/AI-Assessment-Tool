import checkEnvironment from '@/util/check-environment'
import { Text, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Spacer, Flex } from '@chakra-ui/react'

const AI4BelgiumIcon = (): JSX.Element => (
  <div className='px-3 py-5 flex flex-col justify-center font-semibold text-lg cursor-pointer'>
    <Text color='white'> AI<sub className='icon-blue-color text-lg'>4</sub>Belgium</Text>
  </div>
)

export const AI4BelgiumHeader = (): JSX.Element => (
  <Flex minWidth='max-content' alignItems='center' gap='2' p='2' bgColor='rgba(14,16,18)'>
    <AI4BelgiumIcon />
    <Spacer />
    <Breadcrumb color='white' opacity='0.75' px='3' py='5' fontWeight='medium' fontSize='lg'>
      <BreadcrumbItem>
        <BreadcrumbLink href='#'>Docs</BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbItem>
        <BreadcrumbLink href='https://github.com/AI4Belgium/AI-Assessment-Tool'>Source</BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbItem isCurrentPage>
        <BreadcrumbLink href={checkEnvironment()}>Demo</BreadcrumbLink>
      </BreadcrumbItem>
    </Breadcrumb>
  </Flex>
)
