import React, { useRef, useState } from 'react'
import PropType from 'prop-types'
import {
  Box,
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalOverlay,
  useDisclosure,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalFooter,
  Input,
  Text,
  Textarea,
  Select
} from '@chakra-ui/react'
import Link from 'next/link'
import { AiOutlinePlus } from 'react-icons/ai'
import { defaultFetchOptions, fetcher } from '@/util/api'
import useSWR from 'swr'
import { useTranslation } from 'next-i18next'

const CreateProjectModal = ({ fetchProjects }: { fetchProjects: Function }): JSX.Element => {
  const { t } = useTranslation('projects')
  const { data: industries } = useSWR('/api/industries', fetcher)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const inputRef: any = useRef()
  const [description, setDescription] = useState<string>('')
  const [industry, setIndustry] = useState<string>('')

  // useEffect(() => {
  //   console.log('inputRef', inputRef)
  //   if (isOpen && inputRef.current != null) inputRef.current.focus()
  // }, [isOpen, inputRef, inputRef.current])

  const handleSubmit = async (e: any): Promise<void> => {
    if (e != null) e.preventDefault()
    if (e.key === 'Enter') await handleCreate()
  }

  const handleCreate = async (): Promise<void> => {
    try {
      setIsLoading(true)
      const data: any = {
        name: inputRef?.current?.value ?? '',
        description: description ?? ''
      }
      if (industry != null && industry.length > 0) data.industry = industry

      const response = await fetch('/api/projects', {
        ...defaultFetchOptions,
        method: 'POST',
        body: JSON.stringify(data)
      })

      // const inJSON =
      await response.json()
      await fetchProjects()
    } finally {
      onClose()
      setIsLoading(false)
    }
  }

  return (
    <>
      <Button
        onClick={onOpen}
        leftIcon={<AiOutlinePlus />}
        className='background-blue'
        color='white'
        size='lg'
        mt='1rem'
      >
        {t('buttons:create-project')}
      </Button>
      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent mr='2' ml='2'>
          <ModalHeader>{t('projects:create-project')}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              ref={el => { inputRef.current = el }}
              placeholder={`${t('placeholders:project-name')}`}
              onKeyUp={(e) => { void handleSubmit(e) }}
            />
            <Textarea
              placeholder={`${t('placeholders:project-description')}`}
              mt='2' onChange={(e) => setDescription(e.target.value)}
            />
            <Select size='xs' placeholder={`${t('placeholders:select-industry')}`} onChange={e => setIndustry(e.target.value)}>
              {Array.isArray(industries) && industries?.map(industry => (<option key={industry.key} value={industry.name}>{industry.name}</option>))}
            </Select>
          </ModalBody>
          <ModalFooter>
            <Button onClick={() => { void handleCreate() }} isLoading={isLoading} isDisabled={isLoading} loadingText={`${t('projects:creating-project')}`}>
              {t('buttons:create')}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default function Projects (props: any): JSX.Element {
  const { projects = [], fetchProjects }: { projects: any[], fetchProjects: Function } = props

  const loadExistingProjects = (): JSX.Element => {
    return (
      <Flex mt='1rem' minWidth='50vw' flexWrap='wrap'>
        {Array.isArray(projects) && projects.map((pr, index) => (
          <Link
            key={index}
            href={{
              pathname: '/projects/[projectId]',
              query: { projectId: pr._id }
            }}
          >
            <Flex
              mr='1rem'
              mt='1rem'
              height='150px'
              width='150px'
              background={`linear-gradient(
                rgba(0, 0, 0, 0.4),
                rgba(0, 0, 0, 0.4)
              ),
              url(${String(pr.backgroundImage)})`}
              backgroundPosition='center'
              backgroundRepeat='no-repeat'
              backgroundSize='cover'
              borderRadius='5px'
              boxShadow='lg'
              cursor='pointer'
              flexDirection='column'
              justifyContent='center'
            >
              <Text
                height='25px'
                textAlign='center'
                textTransform='capitalize'
                color='white'
                fontSize='20px'
                fontWeight='bold'
                textOverflow='ellipsis'
                noOfLines={3}
              >
                {pr.name}
              </Text>
            </Flex>
          </Link>
        ))}
      </Flex>
    )
  }

  return (
    <Box flexGrow={3} mx='2%' boxShadow='base' rounded='lg' bg='white' p='1rem'>
      <CreateProjectModal fetchProjects={fetchProjects} />
      {loadExistingProjects()}
    </Box>
  )
}

Projects.propTypes = {
  projects: PropType.array,
  session: PropType.object,
  fetchProjects: PropType.func
}
