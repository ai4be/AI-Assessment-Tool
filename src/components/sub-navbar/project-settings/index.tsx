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

const ProjectSettings = ({ project }): JSX.Element => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSave = async (): Promise<void> => {
    setIsLoading(true)
    const data = {
      _id: project._id as string,
      name: project.name,
      dateCreated: project.dateCreated,
      createdBy: project.createdBy,
      backgroundImage: project.backgroundImage
    }

    const url = `/api/projects/${data._id}`

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
    // TODO use context to set project
    onClose()
    setIsLoading(false)
  }

  const handleDelete = async (): Promise<void> => {
    setIsLoading(true)
    const _id = project._id
    const url = `/api/projects/${_id}`
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
      await router.push('/projects')
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
          <ModalHeader>Project Settings</ModalHeader>
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
                    <FormLabel>Project name</FormLabel>
                    <Input
                      value={project.name}
                      onChange={(e) => (project.name = e.target.value)}
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
                  <p>To delete your project, Click on Delete button.</p>
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

export default ProjectSettings
