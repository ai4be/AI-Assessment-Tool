import React, { useContext } from 'react'
import {
  Box, Button,
  // Slide,
  IconButton, Collapse, useDisclosure
} from '@chakra-ui/react'
import ProjectContext from '@/src/store/project-context'
import { useRouter } from 'next/router'
import { QueryFilterKeys } from '@/src/components/project/project-bar/filter-menu'
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons'

interface Props {
  page: string
  isOpen: boolean
  variant: 'menu' | 'sidebar' | undefined | string
  children?: string | JSX.Element | JSX.Element[]
  showSidebarButton?: boolean
}

const SideBar = (props: Props): JSX.Element => {
  const router = useRouter()
  const { [QueryFilterKeys.CATEGORY]: selectedCategoryId } = router.query ?? {}
  const context = useContext(ProjectContext)
  const { isOpen, onToggle } = useDisclosure()

  const content = Array.isArray(context?.categories)
    ? context.categories.map((cat, index) => (
      <Button
        key={cat.key}
        mt='5px'
        mb='5px'
        height='4rem'
        lineHeight={['16px', '16px', '16px', '16px', '32px']}
        fontSize={['12px', '12px', '12px', '12px', '16px']}
        borderRadius='0'
        borderWidth='0'
        padding='0'
        className='capitalize whitespace-normal'
        bgColor={cat._id === selectedCategoryId ? 'var(--main-light-blue)' : 'white'}
        color={cat._id === selectedCategoryId ? '#25282B' : 'var(--text-grey)'}
        whiteSpace='normal'
        _hover={{ bg: 'var(--main-light-blue)' }}
        _focus={{ boxShadow: 'none' }}
        onClick={() => context.categoryClickHandler(cat)}
      >
        <Box display='flex' justifyContent='space-between' width='100%' height='100%' alignItems='center'>
          <Box width='4px' height='100%' bgColor={cat._id === selectedCategoryId ? 'var(--main-blue)' : 'white'} borderRightRadius='5px' />
          <Box px='1rem'>{cat.name}</Box>
          <Box width='4px' height='100%' bgColor='transparent' />
        </Box>
      </Button>
    ))
    : null
  return props.variant === 'sidebar'
    ? (
      <Box display='flex' flexDirection='column' mt='5rem'>
        {content}
      </Box>
      )
    : (
      <>
        <Box display='flex' flexDirection='column'>
          {props.showSidebarButton === true && (
            <Box ml={-4} mr={4}>
              <IconButton
                isRound
                icon={isOpen ? <ChevronLeftIcon w={8} h={8} /> : <ChevronRightIcon w={8} h={8} />}
                colorScheme='blackAlpha'
                aria-label='Display project menu'
                variant='outline'
                bg='white'
                onClick={onToggle}
              />
              <Collapse in={isOpen} animateOpacity>
                <Box pl={4} mt={8}>
                  {content}
                </Box>
              </Collapse>
            </Box>
          )}
          <Box display='flex' flexDirection='column'>
            {props.isOpen && (
              <Box display='flex' flexDirection='column' mt='2.5rem'>
                {content}
              </Box>
            )}
          </Box>
        </Box>
        {props.children}
      </>
      )
}

export default SideBar
