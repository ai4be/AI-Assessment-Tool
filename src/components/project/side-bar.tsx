import React, { useContext } from 'react'
import {
  Box, Button
  // ,
  // Drawer,
  // DrawerOverlay,
  // DrawerCloseButton,
  // DrawerHeader,
  // DrawerBody,
  // DrawerContent,
  // useBreakpointValue,
  // useDisclosure,
  // IconButton
 } from '@chakra-ui/react'
//  import { ChevronRightIcon } from '@chakra-ui/icons'
import ProjectContext from '@/src/store/project-context'
import { useRouter } from 'next/router'
import { QueryFilterKeys } from '@/src/components/project/project-bar/filter-menu'

// (<IconButton
//   icon={<ChevronRightIcon w={8} h={8} />}
//   colorScheme="blackAlpha"
//   variant="outline"
//   onClick={onShowSidebar}
// />)

const SideBar = (props: any): JSX.Element => {
  const router = useRouter()
  const { [QueryFilterKeys.CATEGORY]: selectedCategoryId } = router.query ?? {}
  const context = useContext(ProjectContext)
  // const { isOpen, onClose, onOpen } = useDisclosure()
  // const variants = useBreakpointValue({ base: 'base', md: 'md' })
  // const ref = React.useRef()

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

  // if (true) {
  //   return (
  //     <>
  //       <Box bgColor='black' width='20px' heigth='100%' ref={ref} position='relative'>
  //         <IconButton
  //           icon={<ChevronRightIcon w={8} h={8} />}
  //           colorScheme="blackAlpha"
  //           variant="outline"
  //           onClick={onOpen}
  //         />
  //       </Box>
  //       <Drawer isOpen={isOpen} placement='left' onClose={onClose} portalProps={{ containerRef: ref }}>
  //         {/* <DrawerOverlay> */}
  //         <DrawerContent position='relative'>
  //           <DrawerCloseButton />
  //           <DrawerHeader>Chakra-UI</DrawerHeader>
  //           <DrawerBody position='relative'>
  //             {content}
  //           </DrawerBody>
  //         </DrawerContent>
  //         {/* </DrawerOverlay> */}
  //       </Drawer>
  //     </>
  //   )
  // }
  return (
    <Box display='flex' flexDirection='column' mt='5rem'>
      {content}
    </Box>
  )
}

export default SideBar
