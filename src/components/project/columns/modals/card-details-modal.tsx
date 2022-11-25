import React, { FC, useContext, useEffect, useState } from 'react'
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  Button,
  Input,
  ModalOverlay,
  Text,
  Box,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Badge
} from '@chakra-ui/react'
import { CardDetail } from '@/src/types/cards'
import { AiOutlineDelete, AiOutlineClose, AiOutlineLaptop, AiOutlineDown } from 'react-icons/ai'
import { GrTextAlignFull } from 'react-icons/gr'
import CardLabel from '@/src/components/project/columns/modals/card-labels-menu'
import QuillEditor from '@/src/components/quill-editor'
import ProjectContext from '@/src/store/project-context'
import { fetchUsers } from '@/util/users-fe'
import { updateCard } from '@/util/cards'

interface Props {
  onClose: () => void
  isOpen: boolean
  card: CardDetail
  projectId: string
  fetchCards: () => any
}

const CardDetailsModal: FC<Props> = ({ onClose, isOpen, card, projectId, fetchCards }) => {
  const [title, setTitle] = useState(card?.title)
  const [description, setDescription] = useState(card?.description)
  const [assigned, assignUser] = useState(card?.assignedTo)
  const [isLoading, setIsLoading] = useState(false)
  const projectContext = useContext(ProjectContext)

  const [users, setUsers] = useState<any[]>([])

  useEffect(async (): Promise<void> => {
    const userIds = projectContext.project?.users
    if (Array.isArray(userIds) && userIds.length > 0) {
      const usersData = await fetchUsers(userIds)
      setUsers(usersData)
    } else {
      setUsers((prevState) => {
        if (Array.isArray(prevState) && prevState.length === 0) return prevState
        else return []
      })
    }
  }, [projectContext.project?.users])

  const handleCardDelete = async (): Promise<void> => {
    setIsLoading(true)
    const url = `/api/projects/${projectId}/cards/${card._id}`

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

    const inJSON = await response.json()
    console.log('handleCardDelete', inJSON)
    setIsLoading(false)
    await fetchCards()
    onClose()
  }

  const handleModalClose = async (): Promise<void> => {
    setIsLoading(true)
    const data = {
      _id: card._id,
      title,
      description,
      columnId: card.columnId,
      assignedTo: assigned
    }

    await updateCard(data, projectId)
    await fetchCards()
    setIsLoading(false)
    onClose()
  }

  const handleClick = async (userId: string): Promise<void> => {
    setIsLoading(true)
    assignUser(userId)

    const data = {
      _id: card._id,
      title,
      description,
      columnId: card.columnId,
      assignedTo: userId
    }

    await updateCard(data, projectId)
    setIsLoading(false)
  }

  const assignToMenu = (): JSX.Element => {
    return (
      <Menu>
        <MenuButton as={Button} size='xs' rightIcon={<AiOutlineDown />}>
          Assign To
        </MenuButton>
        <MenuList>
          {users.map((user, index) => (
            <MenuItem key={index} onClick={async () => await handleClick(user._id)}>
              {user?.fullName}
            </MenuItem>
          ))}
          <MenuItem onClick={async () => await handleClick('')}>Unassign</MenuItem>
        </MenuList>
      </Menu>
    )
  }

  return (
    <>
      <Modal size='xl' onClose={handleModalClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        {/* https://github.com/chakra-ui/chakra-ui/discussions/2676 */}
        <ModalContent maxW='64rem'>
          <ModalBody>
            {(card.label != null) && (
              <Badge bg={card.label.type} color='white'>
                {card.label.type}
              </Badge>
            )}
            <Box display='flex' marginTop='1rem'>
              <AiOutlineLaptop />
              <Input
                name='title'
                size='sm'
                marginLeft='1rem'
                value={title}
                fontWeight='bold'
                onChange={(e) => setTitle(e.target.value)}
                placeholder='Card title'
              />
            </Box>
            <Box display='flex'>
              <Box width='100%' marginTop='2rem'>
                <Box display='flex' fontWeight='bold'>
                  <GrTextAlignFull />
                  <Text marginLeft='1rem'>Description</Text>
                </Box>
                <Box marginLeft='1.5rem' minHeight='200px' width='90%'>
                  <QuillEditor value={description} onChange={setDescription} />
                </Box>
              </Box>
              <Box display='flex' flexDirection='column'>
                <CardLabel id={card._id} projectId={card.projectId} />
                {assignToMenu()}
              </Box>
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button
              size='xs'
              marginRight='1rem'
              onClick={handleCardDelete}
              disabled={isLoading}
              isLoading={isLoading}
              loadingText='Deleting'
              bg='red.500'
              color='white'
              _hover={{
                backgroundColor: 'red.600'
              }}
            >
              <AiOutlineDelete />
            </Button>
            <Button
              size='xs'
              onClick={handleModalClose}
              disabled={isLoading}
              isLoading={isLoading}
              loadingText='Updating'
            >
              <AiOutlineClose /> Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default CardDetailsModal
