import React, { createContext, useState, useContext, useEffect } from 'react'
import {
  Button,
  Input,
  Box,
  Flex,
  useDisclosure,
  useToast,
  UseToastOptions,
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
  TabPanel,
  Text
} from '@chakra-ui/react'
import { AiFillSetting, AiOutlineDelete, AiOutlineCheck } from 'react-icons/ai'
import { useRouter } from 'next/router'
import Roles from './roles'
import Team from './team'
import { defaultFetchOptions } from '@/util/api'
import ConfirmDialog from '../../confirm-dialog'

const ProjectName = ({ project }): JSX.Element => {
  const { isBusy, setIsBusy } = useContext(ProjectSettingsContext)
  const toast = useToast()
  const [projectName, setProjectName] = useState(project.name)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsBusy(isLoading)
  }, [isLoading])

  const showToast = (title: string, desc: string, status: any = 'success'): void => {
    status = status as UseToastOptions['status']
    toast({
      position: 'top',
      title,
      description: desc,
      status,
      duration: 2500,
      isClosable: true
    })
  }

  const handleSave = async (): Promise<void> => {
    setIsLoading(true)
    const data = {
      name: projectName,
      backgroundImage: project.backgroundImage
    }
    await new Promise(resolve => setTimeout(resolve, 5000))
    const url = `/api/projects/${String(project._id)}`
    const response = await fetch(url, {
      ...defaultFetchOptions,
      method: 'PATCH',
      body: JSON.stringify(data)
    })
    if (response.ok) {
      project.name = projectName
      showToast('Success', 'Title changed successfully')
    } else {
      showToast('Error', 'Something went wrong', 'error')
    }

    setIsLoading(false)
  }

  return (
    <>
      <FormControl id='email'>
        <FormLabel>Project name</FormLabel>
        <Input
          value={projectName}
          onChange={(e) => (setProjectName(e.target.value))}
        />
        <FormHelperText>You can change this any time</FormHelperText>
      </FormControl>
      <Box align='right'>
        <Button
          backgroundColor='success'
          color='white'
          onClick={handleSave}
          disabled={isLoading || projectName == null || projectName === '' || isBusy}
          isLoading={isLoading}
        >
          <AiOutlineCheck /> &nbsp; Save
        </Button>
      </Box>
    </>
  )
}

const DeleteProject = ({ project }): JSX.Element => {
  const { isBusy, setIsBusy } = useContext(ProjectSettingsContext)
  const [isLoading, setIsLoading] = useState(false)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const router = useRouter()

  useEffect(() => {
    setIsBusy(isLoading)
  }, [isLoading])

  const handleDelete = async (): Promise<void> => {
    setIsLoading(true)
    const url = `/api/projects/${String(project._id)}`
    const response = await fetch(url, {
      ...defaultFetchOptions,
      method: 'DELETE'
    })
    if (response.ok) {
      await router.push('/projects')
    }
    setIsLoading(false)
  }
  return (
    <>
      <Text as='b'>Danger zone</Text>
      <Flex justifyContent='space-between' alignItems='center'>
        <p>To delete your project, Click on Delete button.</p>
        <Box align='right'>
          <Button
            bg='red.500'
            color='white'
            onClick={onOpen}
            _hover={{
              backgroundColor: 'red.600'
            }}
            isLoading={isLoading}
            isDisabled={isLoading || isBusy}
            loadingText='Deleting'
          >
            <AiOutlineDelete /> &nbsp;Delete
          </Button>
        </Box>
        <ConfirmDialog isOpen={isOpen} onClose={onClose} confirmHandler={handleDelete} />
      </Flex>
    </>
  )
}

interface PropsContext {
  isBusy: boolean
  setIsBusy: Function
}

export const ProjectSettingsContext = createContext<PropsContext>({
  isBusy: false,
  setIsBusy: () => {}
})

export function ProjectSettingsContextProvider (props: any): JSX.Element {
  const [isBusy, setIsBusy] = useState<boolean>(false)

  const context = {
    isBusy,
    setIsBusy
  }

  return (
    <ProjectSettingsContext.Provider value={context}>
      {props.children}
    </ProjectSettingsContext.Provider>
  )
}

const ProjectSettings = ({ project }): JSX.Element => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { isBusy } = useContext(ProjectSettingsContext)

  // console.log('isBusy', isBusy)

  return (
    <>
      <Button onClick={onOpen} size='xs' as={Button} m='5px' disabled={isBusy}>
        <AiFillSetting />
      </Button>
      <Modal onClose={onClose} isOpen={isOpen} size='xl' isCentered scrollBehavior='inside' closeOnOverlayClick={!isBusy} closeOnEsc={!isBusy}>
        <ModalOverlay />
        <ModalContent height={['100vh', '60vh']} minWidth='370px'>
          <ModalHeader >Project Settings</ModalHeader>
          <ModalCloseButton disabled={isBusy}/>
          <ModalBody overflowY='scroll'>
            <Tabs isFitted variant='enclosed' defaultIndex={0}>
              <TabList mb='2rem'>
                <Tab>General</Tab>
                <Tab>Team</Tab>
                <Tab>Roles</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <ProjectName project={project} />
                  <hr className='my-3' />
                  <DeleteProject project={project} />
                </TabPanel>
                <TabPanel>
                  <Team project={project} />
                </TabPanel>
                <TabPanel>
                  <Roles project={project} />
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
