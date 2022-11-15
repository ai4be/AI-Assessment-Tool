import React, { useState } from 'react'
import {
  Button,
  Input,
  Box,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  ModalContent,
  FormControl,
  FormLabel,
  FormHelperText,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel
} from '@chakra-ui/react'
import { AiFillSetting, AiOutlineDelete, AiOutlineCheck } from 'react-icons/ai'
import { useRouter } from 'next/router'

const BoardSettings = ({ board }): JSX.Element => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSave = async (): Promise<void> => {
    setIsLoading(true)
    const data = {
      _id: board._id as string,
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

  const handleDelete = async (): Promise<void> => {
    setIsLoading(true)
    const _id = board._id
    const url = `/api/boards/${_id}`
    const response = await fetch(url, {
      method: 'DELETE',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json'
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer'
    })
    if (response.ok) {
      await router.push('/boards')
    }
    setIsLoading(false)
  }

  return (
    <>
      <Button onClick={onOpen} size='xs' as={Button} m='5px'>
        <AiFillSetting />
      </Button>
      <Modal onClose={onClose} isOpen={isOpen} size='xl' isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Board Settings</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Tabs isFitted variant='enclosed'>
              <TabList mb='2rem'>
                <Tab>Basic</Tab>
                <Tab>Advance</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <FormControl id='email'>
                    <FormLabel>Board name</FormLabel>
                    <Input
                      value={board.name}
                      onChange={(e) => (board.name = e.target.value)}
                    />
                    <FormHelperText>You can change this any time</FormHelperText>
                  </FormControl>
                  <Box align='right'>
                    <Button
                      backgroundColor='success'
                      color='white'
                      onClick={handleSave}
                      isLoading={isLoading}
                    >
                      <AiOutlineCheck /> &nbsp; Save
                    </Button>
                  </Box>
                </TabPanel>
                <TabPanel>
                  <p>To delete your board, Click on Delete button.</p>
                  <Box align='right'>
                    <Button
                      bg='red.500'
                      color='white'
                      onClick={handleDelete}
                      _hover={{
                        backgroundColor: 'red.600'
                      }}
                      isLoading={isLoading}
                      loadingText='Deleting'
                    >
                      <AiOutlineDelete /> &nbsp;Delete
                    </Button>
                  </Box>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </ModalBody>
          <ModalFooter />
        </ModalContent>
      </Modal>
    </>
  )
}

export default BoardSettings
