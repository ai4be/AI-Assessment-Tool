import React, { createContext, useState, useContext, useEffect } from 'react'
import {
  Button,
  Input,
  Box,
  Flex,
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
  Select,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Text,
  Textarea
} from '@chakra-ui/react'
import { AiFillSetting, AiOutlineDelete, AiOutlineCheck } from 'react-icons/ai'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import Roles from './roles'
import Team from './team'
import { defaultFetchOptions, fetcher, HTTP_METHODS } from '@/util/api'
import ConfirmDialog from '../../confirm-dialog'
import { isEmpty } from '@/util/index'
import ToastContext from '@/src/store/toast-context'
import { Project } from '@/src/types/project'

const ProjectBaseProperties = ({ project }: { project: Project }): JSX.Element => {
  const { data: industries, error } = useSWR('/api/industries', fetcher)
  const { isBusy, setIsBusy } = useContext(ProjectSettingsContext)
  const { showToast } = useContext(ToastContext)
  const [projectName, setProjectName] = useState(project.name)
  const [description, setDescription] = useState(project.description)
  const [industry, setIndustry] = useState<string | undefined>(project.industry)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsBusy(isLoading)
  }, [isLoading])

  const handleSave = async (): Promise<void> => {
    setIsLoading(true)
    const data: Partial<Project> = {}

    if (projectName !== project.name) data.name = projectName
    if (description !== project.description) data.description = description
    if (industry !== project.industry) data.industry = industry
    if (!isEmpty(data)) {
      const url = `/api/projects/${String(project._id)}`
      const response = await fetch(url, {
        ...defaultFetchOptions,
        method: HTTP_METHODS.PATCH,
        body: JSON.stringify(data)
      })
      if (response.ok) {
        project.name = projectName
        project.description = description
        project.industry = industry
        showToast({ title: 'Success', description: 'Successfully saved' })
      } else {
        showToast({ title: 'Error', description: 'Something went wrong', status: 'error' })
      }
    }
    setIsLoading(false)
  }

  return (
    <>
      <FormControl id='name'>
        <FormLabel>Project name</FormLabel>
        <Input
          value={projectName}
          onChange={(e) => (setProjectName(e.target.value))}
        />
        <FormHelperText>You can change this any time</FormHelperText>
      </FormControl>
      <FormControl id='description' mt='1.5'>
        <FormLabel>Project description</FormLabel>
        <Textarea
          value={description}
          onChange={(e) => (setDescription(e.target.value))}
        />
      </FormControl>
      <FormControl id='description' my='1.5'>
        <FormLabel>Project industry</FormLabel>
        <Select size='xs' placeholder='Select the industry' onChange={e => setIndustry(e.target.value)} value={String(industry)}>
          {industries?.map((industry, idx) => (<option key={industry.key} value={industry.name}>{industry.name}</option>))}
        </Select>
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
      method: HTTP_METHODS.DELETE
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
        <ModalContent height={['100vh', '60vh']} minWidth='370px' mr='2' ml='2'>
          <ModalHeader>Project Settings</ModalHeader>
          <ModalCloseButton disabled={isBusy} />
          <ModalBody overflowY='scroll'>
            <Tabs isFitted variant='enclosed' defaultIndex={0}>
              <TabList mb='2rem'>
                <Tab _focus={{ boxShadow: 'none' }}>General</Tab>
                <Tab _focus={{ boxShadow: 'none' }}>Team</Tab>
                <Tab _focus={{ boxShadow: 'none' }}>Roles</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <ProjectBaseProperties project={project} />
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
