import React, { FC, useContext, useEffect, useState } from 'react'
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
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
  Badge,
  border,
  RadioGroup,
  Radio,
  Stack,
  CheckboxGroup,
  Checkbox
} from '@chakra-ui/react'
import { CardDetail } from '@/src/types/cards'
import { AiOutlineDelete, AiOutlineClose, AiOutlineLaptop, AiOutlineDown } from 'react-icons/ai'
import { FiUserPlus } from 'react-icons/fi'
import { GrTextAlignFull } from 'react-icons/gr'
import CardLabel from '@/src/components/project/columns/modals/card-labels-menu'
import QuillEditor from '@/src/components/quill-editor'
import ProjectContext from '@/src/store/project-context'
import { fetchUsers } from '@/util/users-fe'
import { updateCard } from '@/util/cards'
import { defaultFetchOptions } from '@/util/api'
import { SingleDatepicker } from '@/src/components/date-picker'
import { FiEdit2 } from 'react-icons/fi'
import { format } from 'date-fns'
import { UserMenu } from '@/src/components/user-menu'

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
  const [date, setDate] = useState(card?.dueDate)

  const [users, setUsers] = useState<any[]>([])

  useEffect((): void => {
    const userIds = projectContext.project?.users
    if (Array.isArray(userIds) && userIds.length > 0) {
      void fetchUsers(userIds).then(usersData => setUsers(usersData))
    } else {
      setUsers((prevState) => {
        if (Array.isArray(prevState) && prevState.length === 0) return prevState
        else return []
      })
    }
  }, [projectContext.project?.users])

  const handleCardDelete = async (): Promise<void> => {
    setIsLoading(true)
    const url = `/api/projects/${projectId}/cards/${String(card._id)}`

    const response = await fetch(url, {
      ...defaultFetchOptions,
      method: 'DELETE'
    })

    const inJSON = await response.json()
    setIsLoading(false)
    await fetchCards()
    onClose()
  }

  const handleModalClose = async (): Promise<void> => {
    setIsLoading(true)
    // const data = {
    //   _id: card._id,
    //   title,
    //   description,
    //   columnId: card.columnId,
    //   assignedTo: assigned
    // }

    // await updateCard(data, projectId)
    // await fetchCards()
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
            <MenuItem key={index} onClick={() => handleClick(user._id)}>
              {user?.fullName}
            </MenuItem>
          ))}
          <MenuItem onClick={() => handleClick('')}>Unassign</MenuItem>
        </MenuList>
      </Menu>
    )
  }

  return (
    <Modal size='xl' onClose={handleModalClose} isOpen={isOpen} isCentered overflow='hidden'>
      <ModalOverlay maxHeight='100vh' />
      {/* https://github.com/chakra-ui/chakra-ui/discussions/2676 */}
      <ModalContent maxW='64rem' overflow='hidden' minHeight='50vh' maxHeight={['100vh', '90vh']} position='relative'>
        <ModalBody p='0' height='100%' display='flex' width='100%' overflowY='scroll' position='relative'>
          {(card.label != null) && (
            <Badge bg={card.label.type} color='white'>
              {card.label.type}
            </Badge>
          )}
          <Flex flexDirection='column' height='100%' width='100%' justifyContent='space-between'>
            <Box display='flex'>
              <Box width='100%' marginTop='2rem' ml='4'>
                <Box ml='-4' position='relative'>
                  <Box width='4px' bgColor='var(--main-blue)' borderRightRadius='15px' height='100%' position='absolute' left='0' top='0' />
                  <Text fontSize={[16, 20]} fontWeight='400' px='4'>
                    {card.title.replace(/=g(b|e)=/g, '')}
                  </Text>
                </Box>
                <Accordion allowToggle allowMultiple>
                  <AccordionItem
                    border='none'
                    isFocusable={false}
                    _hover={{
                      boxShadow: 'none',
                      border: 'none'
                    }}
                  >
                    <AccordionButton
                      display='flex' alignItems='center' boxShadow='none' _hover={{
                        boxShadow: 'none',
                        border: 'none'
                      }} _focus={{ boxShadow: 'none' }} _expanded={{ boxShadow: 'none' }}>
                      <Text color='var(--main-blue)' fontSize='sm' as='b'>Example</Text>
                      <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel pb={4} border='none'>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                      tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
                      veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                      commodo consequat.
                    </AccordionPanel>
                  </AccordionItem>

                  <AccordionItem
                    border='none'
                    isFocusable={false}
                    _hover={{
                      boxShadow: 'none',
                      border: 'none'
                    }}
                    _focus={{ boxShadow: 'none !important' }}
                    _expanded={{ boxShadow: 'none' }}
                  >
                    <AccordionButton
                      display='flex' alignItems='center' boxShadow='none'
                      _hover={{
                        boxShadow: 'none',
                        border: 'none'
                      }}
                      _focus={{ boxShadow: 'none !important' }}
                    >
                      <Text color='var(--main-blue)' fontSize='sm' as='b'>Recommandation</Text>
                      <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel pb={4} border='none'>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                      tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
                      veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                      commodo consequat.
                    </AccordionPanel>
                  </AccordionItem>
                </Accordion>
                {card?.questions?.map((q, index) => (
                  <Box p={3} key={q.id}>
                    <Text color='var(--main-blue)' fontSize='sm' as='b' display='block'>
                      {q.title?.replace(/=g(b|e)=/g, '').replace(/=hb=.*=he=/g, '')}
                    </Text>
                    <GenerateAnswers question={q} />
                  </Box>
                ))}
              </Box>
              <Flex flexDirection='column' minWidth='241px' backgroundColor='#FAFAFA' justifyContent='space-between' p={3} pt='2'>
                <Flex flexDirection='column'>
                  <Flex justifyContent='flex-end'>
                    <ModalCloseButton position='relative' />
                  </Flex>
                  <Flex justifyContent='space-between' alignItems='center'>
                    <Text color='var(--main-blue)' fontSize='sm' as='b' mb='2'>Due date</Text>
                  </Flex>
                  <SingleDatepicker name='date-input' date={date} onDateChange={setDate}>
                    <Text fontSize='sm' fontWeight='600' w='100%' minH='2'>
                      {date != null ? format(date, 'dd MMM yyyy') : 'click to set'}
                    </Text>
                  </SingleDatepicker>
                  <Flex justifyContent='space-between' alignItems='center'>
                    <Text color='var(--main-blue)' fontSize='sm' as='b' mt='3' mb='2'>Responsable</Text>
                    <UserMenu users={users} includedUserIds={card.userIds ?? []} onUserAdd={() => {}} onUserRemove={() => {}}>
                      <FiEdit2 color='#C9C9C9' cursor='pointer' />
                    </UserMenu>
                  </Flex>
                  {/* <CardLabel id={card._id} projectId={card.projectId} />
                  {assignToMenu()}
                </Flex>
                <Flex flexDirection='column'>
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
                  </Button>*/}
                </Flex>
              </Flex>
            </Box>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default CardDetailsModal

export const GenerateAnswers = ({ question }): JSX.Element => {
  const [value, setValue] = React.useState(null)
  if (question.type === 'radio') {
    return (
      <RadioGroup onChange={setValue} value={value}>
        <Stack direction='row'>
          {question.answers.map((a, idx) => (
            <Radio key={idx} value={idx} fontSize='10px'>{a?.replace(/=g(b|e)=/g, '').replace(/=hb=.*=he=/g, '')}</Radio>
          ))}
        </Stack>
      </RadioGroup>
    )
  } else if (question.type === 'checkbox') {
    return (
      <CheckboxGroup onChange={setValue} value={value}>
        <Stack direction='row'>
          {question.answers.map((a, idx) => (
            <Checkbox size='md' key={idx} value={idx} fontSize='10px'>{a?.replace(/=g(b|e)=/g, '').replace(/=hb=.*=he=/g, '')}</Checkbox>
          ))}
        </Stack>
      </CheckboxGroup>
    )
  }
  return <></>
}
