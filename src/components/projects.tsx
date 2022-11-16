import React, { useState } from 'react'
import PropType from 'prop-types'
import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalOverlay,
  useDisclosure,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalFooter,
  Input,
  Text
} from '@chakra-ui/react'
import Link from 'next/link'
import { AiOutlinePlus } from 'react-icons/ai'
import shortId from 'shortid'

export default function Projects (props: any[]): JSX.Element {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const project: any = {}
  const { projects = [] }: { projects: any[] } = props

  const handleCreate = async (): Promise<void> => {
    setIsLoading(true)
    const id = shortId.generate()
    const date = new Date().toLocaleString()
    // TODO
    onClose()
    setIsLoading(false)
  }

  const handleChange = (e): void => {
    const data = {
      type: 'name',
      value: e.target.value
    }

    // TODO
  }

  const createProjectModal = (): JSX.Element => {
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
          Create a project
        </Button>
        <Modal onClose={onClose} isOpen={isOpen} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Create project</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Input
                value={project.name}
                onChange={(e) => handleChange(e)}
                placeholder='Project name'
              />
            </ModalBody>
            <ModalFooter>
              <Button onClick={handleCreate} isLoading={isLoading} isDisabled={isLoading} loadingText='Creating Project'>
                Create
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    )
  }

  const loadExistingProjects = (): JSX.Element => {
    return (
      <Box mt='1rem' minWidth='50vw' display='flex' flexWrap='wrap'>
        {projects.map((pr, index) => (
          <Link
            key={index}
            href={{
              pathname: '/projects/[slug]',
              query: { slug: pr._id }
            }}
          >
            <Box
              mr='1rem'
              mt='1rem'
              height='150px'
              width='150px'
              background={`linear-gradient(
                rgba(0, 0, 0, 0.4),
                rgba(0, 0, 0, 0.4)
              ),
              url(${pr.backgroundImage})`}
              backgroundPosition='center'
              backgroundRepeat='no-repeat'
              backgroundSize='cover'
              borderRadius='5px'
              boxShadow='lg'
              cursor='pointer'
            >
              <Text
                marginTop='calc(50% - 25px)'
                height='25px'
                textAlign='center'
                textTransform='capitalize'
                color='white'
                fontSize='20px'
                fontWeight='bold'
              >
                {pr.name}
              </Text>
            </Box>
          </Link>
        ))}
      </Box>
    )
  }

  return (
    <Box flexGrow={3} mx='2%' boxShadow='base' rounded='lg' bg='white' p='1rem'>
      {createProjectModal()}
      {loadExistingProjects()}
    </Box>
  )
}

Projects.propTypes = {
  projects: PropType.array
}
