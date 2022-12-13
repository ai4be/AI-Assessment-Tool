import React, { FC, Fragment, memo, useContext, useEffect, useMemo, useState } from 'react'
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
  Textarea,
  Box,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Badge,
  RadioGroup,
  Radio,
  Stack,
  CheckboxGroup,
  Checkbox,
  Avatar,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody
} from '@chakra-ui/react'
import { RiDeleteBin6Line } from 'react-icons/ri'
import isEmpty from 'lodash.isempty'
import { AiOutlineDelete, AiOutlineClose, AiOutlineLaptop, AiOutlineDown } from 'react-icons/ai'
import { FiUserPlus } from 'react-icons/fi'
import { GrTextAlignFull } from 'react-icons/gr'
import CardLabel from '@/src/components/project/columns/modals/card-labels-menu'
import QuillEditor from '@/src/components/quill-editor'
import ProjectContext from '@/src/store/project-context'
import { fetchUsers, getUserDisplayName } from '@/util/users-fe'
import { updateCard } from '@/util/cards'
import { defaultFetchOptions } from '@/util/api'
import { SingleDatepicker } from '@/src/components/date-picker'
import { FiEdit2 } from 'react-icons/fi'
import { AiOutlineQuestionCircle } from 'react-icons/ai'
import { format } from 'date-fns'
import { UserMenu } from '@/src/components/user-menu'
import isEqual from 'lodash.isequal'
import { Mention, MentionsInput } from 'react-mentions';
import { IoMdHelpCircle } from 'react-icons/io'
import UserContext from '@/src/store/user-context'

const loremIpsum = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
commodo consequat.`


const QuestionHelp = ({ question }): JSX.Element => {
  const [help, setHelp] = useState('')

  useEffect(() => {
    if (question.title != null) {
      const match = question.title.match(/=hb=(.*)=he=/)
      if (match?.[1] != null) {
        const h = match[1].replace(/=br=/g, '<br />').trim()
        setHelp(h)
      }
    }
  }
  , [question.title])

  return (
    <>
      {!isEmpty(help) &&
        <Popover>
          <PopoverTrigger>
            <AiOutlineQuestionCircle cursor='pointer' display='inline-block' style={{ display: 'inline-block' }} />
          </PopoverTrigger>
          <PopoverContent>
            <PopoverArrow />
            <PopoverCloseButton />
            <PopoverBody dangerouslySetInnerHTML={{ __html: help }} color='var(--chakra-colors-gray-800)' fontWeight='light' />
          </PopoverContent>
        </Popover>}
    </>
  )
}


const Question = ({ question, onChange, index, chapterNb, ...rest }): JSX.Element => {
  const [conclusion, setConclusion] = useState(question.conclusion ?? '')
  const [timeoutId, setTimeoutId] = useState<any>(null)
  useEffect(() => {
    if (timeoutId != null) clearTimeout(timeoutId)
    const tId = setTimeout(() => onChange(question, null, conclusion), 800)
    setTimeoutId(tId)
    return () => {
      timeoutId != null ? clearTimeout(timeoutId) : null
    }
  }, [conclusion])

  const noRenderOnTimeoutchange = useMemo(() => (
    <Box p={3}>
      <Text color='var(--main-blue)' fontSize='sm' as='b' display='block'>
        {`${chapterNb}.${index + 1} ${question.title?.replace(/=g(b|e)=/g, '').replace(/=hb=.*=he=/g, '')}`}
        <QuestionHelp question={question} />
      </Text>
      <Box ml='1.5'>
        <GenerateAnswers question={question} onChange={value => onChange(question, value)} />
        <Text color='var(--main-blue)' fontSize='sm' as='b' display='block'>
          Conclusion
        </Text>
        <Textarea placeholder='Motivate your answer' size='sm' style={{ resize: 'none' }} value={conclusion} onChange={(e) => setConclusion(e.target.value)}/>
      </Box>
    </Box>
  ), [question, conclusion]
  )

  return (<>{noRenderOnTimeoutchange}</>)
}

const AccordionItemStyled = ({ title, desc }): JSX.Element => {
  return (
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
        <Text color='var(--main-blue)' fontSize='sm' as='b'>{title}</Text>
        <AccordionIcon />
      </AccordionButton>
      <AccordionPanel pb={4} border='none'>
        {desc}
      </AccordionPanel>
    </AccordionItem>
  )
}

const Comment = ({ comment }): JSX.Element => {
  const { users } = useContext(ProjectContext)
  const { user } = useContext(UserContext)
  const [value, setValue] = useState(comment?.text ?? '')
  const mentionsUsers: any[] = useMemo((): any[] => users?.map(u => ({ id: u._id, display: u.name }) ?? []), [users])

  return (
    <MentionsInput
      value={value}
      onChange={(e) => setValue(e.target.value)}
    >
      <Mention
        trigger='@'
        data={mentionsUsers}
      />
    </MentionsInput>
  )
}

const Comments = ({ comments }): JSX.Element => {

}

interface Props {
  onClose: () => void
  isOpen: boolean
  card: any
  projectId: string
  fetchCards: () => any
}

const CardDetailsModal: FC<Props> = ({ onClose, isOpen, card, projectId, fetchCards }) => {
  card.userIds = card.userIds ?? []
  const [title, setTitle] = useState(card?.title)
  const [description, setDescription] = useState(card?.desc)
  const [isLoading, setIsLoading] = useState(false)
  const { users } = useContext(ProjectContext)
  const [date, setDate] = useState(card?.dueDate ? new Date(card.dueDate) : null)
  const [userIdTrigger, setUserIdTrigger] = useState(0)
  const [assignedUsers, setAssignedUsers] = useState<any[]>([])
  const [chapterNb, setChapterNb] = useState(null)

  useEffect(() => {
    const stringIds = card.userIds.map(id => String(id)) ?? []
    setAssignedUsers(users?.filter(user => stringIds.includes(String(user._id))) ?? [])
  }, [card.userIds, userIdTrigger])

  useEffect(() => {
    if (date !== card.date) {
      const data = {
        _id: card._id,
        dueDate: date instanceof Date ? +date : date
      }
      void updateCard(data, card.projectId)
    }
  }, [date])

  useEffect(() => {
    if (card.title != null) {
      const nb = card.title.match(/^\s?([0-9.]+)/)
      if (Array.isArray(nb)) setChapterNb(nb[1])
    }
  }, [card?.title])


  const handleModalClose = async (): Promise<void> => {
    setIsLoading(true)
    const data = {
      _id: card._id,
      columnId: card.columnId
    }


    // await updateCard(data, projectId)
    // await fetchCards()
    setIsLoading(false)
    onClose()
  }

  const handleClick = async (userId: string): Promise<void> => {
    setIsLoading(true)

    const data = {
      _id: card._id,
      title,
      desc: description,
      columnId: card.columnId
    }

    await updateCard(data, projectId)
    setIsLoading(false)
  }

  const saveQuestion = async (question: any, responses?: any[], conclusion?: string): Promise<void> => {
    setIsLoading(true)
    const url = `/api/projects/${String(card.projectId)}/cards/${String(card._id)}/questions/${String(question.id)}`
    const data = {}
    if (responses != null) {
      if (question != null && !isEqual(question.responses?.sort(), responses.sort())) {
        data['responses'] = responses
      }
    }
    if (conclusion != null && !isEqual(question.conclusion, conclusion)) data['conclusion'] = conclusion

    if (isEmpty(data)) return

    const response = await fetch(url, {
      ...defaultFetchOptions,
      method: 'PATCH',
      body: JSON.stringify(data)
    })
    if (!response.ok) {
      // TODO
    } else {
      if (conclusion != null) question.conclusion = conclusion
      if (responses != null) question.responses = responses
    }
    setIsLoading(false)
  }

  const onUserAdd = async (userId: string): Promise<void> => {
    card.userIds = card.userIds ?? []
    card.userIds.push(userId)
    setUserIdTrigger(userIdTrigger + 1)
    const url = `/api/projects/${String(card.projectId)}/cards/${String(card._id)}/users/${userId}`
    const response = await fetch(url, {
      ...defaultFetchOptions,
      method: 'POST',
      body: JSON.stringify({})
    })
    if (!response.ok) {
      card.userIds = card.userIds.filter(id => String(id) !== String(userId))
      setUserIdTrigger(userIdTrigger + 1)
    }
  }

  const onUserRemove = async (userId: string): Promise<void> => {
    card.userIds = card.userIds ?? []
    card.userIds = card.userIds.filter(id => String(id) !== String(userId))
    setUserIdTrigger(userIdTrigger + 1)
    const url = `/api/projects/${String(card.projectId)}/cards/${String(card._id)}/users/${userId}`
    const response = await fetch(url, {
      ...defaultFetchOptions,
      method: 'DELETE',
      body: JSON.stringify({})
    })
    if (!response.ok) {
      // TODO
    }
  }

  return (
    <Modal size='xl' onClose={handleModalClose} isOpen={isOpen} isCentered>
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
                  <AccordionItemStyled title='Example' desc={loremIpsum} />
                  <AccordionItemStyled title='Recommandation' desc={loremIpsum} />
                </Accordion>
                {card?.questions?.map((q, index) =>
                  <Fragment key={index}>
                    <Question question={q} index={index} chapterNb={chapterNb} onChange={saveQuestion} />
                    <Comment comment={{ }} />
                  </Fragment>
                )}
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
                    <Flex justifyContent='space-between' alignItems='center'>
                      <Text fontSize='sm' fontWeight='600' w='100%' minH='2'>
                        {date != null ? format(date, 'dd MMM yyyy') : 'click to set'}
                      </Text>
                      {date != null && <RiDeleteBin6Line color='#C9C9C9' cursor='pointer' onClick={() => setDate(null)} />}
                    </Flex>
                  </SingleDatepicker>
                  <Flex justifyContent='space-between' alignItems='center'>
                    <Text color='var(--main-blue)' fontSize='sm' as='b' mt='3' mb='2'>Responsable</Text>
                    <UserMenu users={users ?? []} includedUserIds={card.userIds ?? []} onUserAdd={onUserAdd} onUserRemove={onUserRemove} userIdTrigger={userIdTrigger}>
                      <FiEdit2 color='#C9C9C9' cursor='pointer' />
                    </UserMenu>
                  </Flex>
                  {assignedUsers.map(user => (
                    <Flex key={user._id} paddingY='1'>
                      <Avatar size='xs' name={getUserDisplayName(user)} src={user.xsAvatar} />
                      <Text fontSize='sm' fontWeight='600' ml='2'>{getUserDisplayName(user)}</Text>
                    </Flex>))}
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

export const GenerateAnswers = ({ question, onChange }: { question: any, onChange?: Function }): JSX.Element => {
  const [value, setValue] = React.useState<any>(question.responses ??  '')
  const valueHandler = (value): void => {
    if (!Array.isArray(value)) value = [value]
    if (Array.isArray(value) && value.length > 1) {
      value = value.filter(v => v !== '')
      value = [...new Set<any>(value)]
    }
    setValue(value)
    if (onChange != null) onChange(value)
  }
  if (question.type === 'radio') {
    return (
      <RadioGroup onChange={valueHandler} value={value[0]} name={question.id}>
        <Stack direction='row'>
          {question?.answers?.map((a, idx) => (
            <Radio key={idx} value={`${idx}`} size='sm' fontSize='sm'>{a?.replace(/=g(b|e)=/g, '').replace(/=hb=.*=he=/g, '')}</Radio>
          ))}
        </Stack>
      </RadioGroup>
    )
  } else if (question.type === 'checkbox') {
    return (
      <CheckboxGroup onChange={valueHandler} value={Array.isArray(value) ? value : [value]}>
        <Stack direction='row'>
          {question?.answers?.map((a, idx) => (
            <Checkbox size='sm' key={idx} value={`${idx}`} fontSize='sm'>{a?.replace(/=g(b|e)=/g, '').replace(/=hb=.*=he=/g, '')}</Checkbox>
          ))}
        </Stack>
      </CheckboxGroup>
    )
  }
  return <></>
}
