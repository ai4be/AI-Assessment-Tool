import React, { useContext } from 'react'
import {
  Box, Button
} from '@chakra-ui/react'
//  import { ChevronRightIcon } from '@chakra-ui/icons'
import ProjectContext from '@/src/store/project-context'
import { useRouter } from 'next/router'
import { QueryFilterKeys } from '@/src/components/project/project-bar/filter-menu'

const ChecklistTopBar = (props: any): JSX.Element => {
  const router = useRouter()
  const { [QueryFilterKeys.CATEGORY]: selectedCategoryId } = router.query ?? {}
  const context = useContext(ProjectContext)

  const content = Array.isArray(context?.categories)
    ? context.categories.map((cat, index) => (
      <Button
        display='flex'
        flexDirection='column'
        justifyContent='space-between'
        boxSizing='border-box'
        key={cat.key}
        mt='5px'
        mb='5px'
        height='4rem'
        padding='0'
        paddingTop='0.5rem'
        lineHeight={['12px', '12px', '12px', '12px', '16px']}
        fontSize={['10px', '10px', '10px', '10px', '12px']}
        borderRadius='0'
        borderWidth='0'
        className='capitalize whitespace-normal'
        bgColor={cat._id === selectedCategoryId ? 'var(--main-light-blue)' : 'white'}
        color={cat._id === selectedCategoryId ? '#25282B' : 'var(--text-grey)'}
        // border='4px solid transparent'
        whiteSpace='normal'
        _hover={{ bg: 'var(--main-light-blue)' }}
        _focus={{ boxShadow: 'none' }}
        onClick={() => context.categoryClickHandler(cat)}
      >
        {/* <Box display='block' height='4px' width='100%' backgroundColor='transparent' /> */}
        <Box paddingX='0.5rem' display='block' boxSizing='border-box'>{cat.name}</Box>
        <Box display='block' height='4px' width='100%' backgroundColor={cat._id === selectedCategoryId ? 'var(--main-blue)' : 'transparent'} />
      </Button>
    ))
    : null

  return (
    <Box display='flex' mt='1rem' className='print:hidden'>
      {content}
    </Box>
  )
}

export default ChecklistTopBar
