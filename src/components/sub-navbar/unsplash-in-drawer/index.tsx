import {
  Button,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure
} from '@chakra-ui/react'
import PropType from 'prop-types'
import React, { useState } from 'react'
import { BsImages } from 'react-icons/bs'
import Unsplash from '@/src/components/sub-navbar/unsplash-in-drawer/unsplash'

const SubNavbar = ({ board }): JSX.Element => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [isLoading, setIsLoading] = useState(false)
  const btnRef = React.useRef()

  const handleSave = async () => {
    setIsLoading(true)
    const data = {
      _id: board._id,
      name: board.name,
      dateCreated: board.dateCreated,
      createdBy: board.createdBy,
      backgroundImage: board.backgroundImage
    }

    const url = `/api/boards/${data._id}`

    const response = await fetch(url, {
      method: 'PATCH',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json'
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: JSON.stringify(data)
    })

    const json = await response.json()
    // TODO use context to set board
    onClose()
    setIsLoading(false)
  }

  return (
    <>
      <Button size='xs' ml='2px' mr='10px' ref={btnRef} onClick={onOpen}>
        <BsImages />
      </Button>
      <Drawer size='sm' isOpen={isOpen} placement='right' onClose={onClose} finalFocusRef={btnRef}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Choose background image</DrawerHeader>
          <DrawerBody>
            <Unsplash />
          </DrawerBody>
          <DrawerFooter>
            <Button
              colorScheme='blue'
              onClick={handleSave}
              loadingText='Saving'
              isLoading={isLoading}
            >
              Save
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
}

SubNavbar.propTypes = {
  board: PropType.object
}

export default SubNavbar
