import React, { useContext } from 'react'
import { Box, Button } from '@chakra-ui/react'
import ProjectContext from '@/src/store/project-context'

const SideBar = (props: any): JSX.Element => {
  const context = useContext(ProjectContext)
  return (
    <Box display='flex' flexDirection='column' mt='5rem'>
      {context.categories.map((cat, index) => (
        <Button
          key={cat.key}
          mt='5px'
          mb='5px'
          height='4rem'
          lineHeight='32px'
          fontSize='16px'
          borderRadius='0'
          borderWidth='0'
          padding='0'
          className='capitalize whitespace-normal'
          bgColor={cat._id === context.selectedCategory?._id ? 'var(--main-light-blue)' : 'white'}
          color={cat._id === context.selectedCategory?._id ? '#25282B' : 'var(--text-grey)'}
          whiteSpace='normal'
          _hover={{ bg: 'var(--main-light-blue)' }}
          _focus={{ boxShadow: 'none' }}
          onClick={() => context.setSelectedCategory(cat)}
        >
          <Box display='flex' justifyContent='space-between' width='100%' height='100%' alignItems='center'>
            <Box width='4px' height='100%' bgColor={cat._id === context.selectedCategory?._id ? 'var(--main-blue)' : 'white'} borderRightRadius='5px' />
            <Box px='1rem'>{cat.name}</Box>
            <Box width='4px' height='100%' bgColor='transparent' />
          </Box>
        </Button>
      ))}
    </Box>
  )
}

export default SideBar
