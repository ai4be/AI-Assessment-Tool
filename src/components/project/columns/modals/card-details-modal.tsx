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
  ModalOverlay,
  Text,
  Box,
  Select,
  Avatar
} from '@chakra-ui/react'
import { RiDeleteBin6Line } from 'react-icons/ri'
import { isEmpty, isEqual } from '@/util/index'
import ProjectContext from '@/src/store/project-context'
import { getUserDisplayName } from '@/util/users'
import { defaultFetchOptions, HTTP_METHODS, getResponseHandler } from '@/util/api'
import { SingleDatepicker } from '@/src/components/date-picker'
import { FiEdit2 } from 'react-icons/fi'
import { format } from 'date-fns'
import { UserMenu } from '@/src/components/user-menu'
import CommentComponent from './comment'
import { questionEnabler } from '@/util/question'
import { Question, DisplayQuestion, Card, CardStage, DisplayCard, STAGE_VALUES } from '@/src/types/card'
import { Comment } from '@/src/types/comment'
import { QuestionComp } from '@/src/components/project/columns/modals/question'
import ToastContext from '@/src/store/toast-context'

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

interface Props {
  onClose: () => void
  isOpen: boolean
  card: DisplayCard
  projectId: string
  fetchCards: () => any
}

const CardDetailsModal: FC<Props> = ({ onClose, isOpen, card, projectId, fetchCards }) => {
  card.userIds = card.userIds ?? []
  const cardId = String(card._id)
  const [isLoading, setIsLoading] = useState(false)
  const { users } = useContext(ProjectContext)
  const { showToast } = useContext(ToastContext)
  const [renderTrigger, setRenderTrigger] = useState(0)
  const [assignedUsers, setAssignedUsers] = useState<any[]>([])

  const responseHandler = getResponseHandler(showToast)

  useEffect(() => {
    const stringIds = card.userIds?.map(id => String(id)) ?? []
    setAssignedUsers(users?.filter(user => stringIds.includes(String(user._id))) ?? [])
  }, [card.userIds, renderTrigger])

  const saveQuestion = async (question: Question, responses?: any[], conclusion?: string): Promise<void> => {
    setIsLoading(true)
    try {
      const url = `/api/projects/${projectId}/cards/${cardId}/questions/${question.id}`
      const data: any = {}
      if (Array.isArray(responses)) {
        if (!Array.isArray(question?.responses) || (Array.isArray(question?.responses) && !isEqual(question.responses?.sort(), responses.sort()))) {
          data.responses = responses
        }
      }
      if (conclusion != null && question.conclusion !== conclusion) data.conclusion = conclusion

      if (isEmpty(data)) return

      const response = await fetch(url, {
        ...defaultFetchOptions,
        method: HTTP_METHODS.PATCH,
        body: JSON.stringify(data)
      })
      if (!response.ok) {
        await responseHandler(response)
      } else {
        if (conclusion != null) question.conclusion = conclusion
        if (responses != null) question.responses = responses
      }
      recalculateEnableing()
    } finally {
      setIsLoading(false)
    }
  }

  const saveComment = async (comment: Partial<Comment>, data: Partial<Comment>, question: DisplayQuestion): Promise<void> => {
    setIsLoading(true)
    let method = HTTP_METHODS.PATCH
    let url = `/api/projects/${projectId}/cards/${cardId}/questions/${question.id}/comments/${comment._id}`
    if (isEmpty(comment._id)) {
      method = HTTP_METHODS.POST
      url = `/api/projects/${projectId}/cards/${cardId}/questions/${question.id}/comments`
    }
    const response = await fetch(url, {
      ...defaultFetchOptions,
      method,
      body: JSON.stringify(data)
    })
    if (response.ok) {
      const newComment = await response.json()
      question.comments = question.comments ?? []
      const commentIdx = question.comments.findIndex(c => c._id === comment._id)
      if (commentIdx >= 0) question.comments.splice(commentIdx, 1, newComment)
      else question.comments = [newComment, ...question.comments]
      setRenderTrigger(renderTrigger + 1)
    } else {
      await responseHandler(response)
    }
    setIsLoading(false)
  }

  const onUserAdd = async (userId: string): Promise<void> => {
    card.userIds = card.userIds ?? []
    card.userIds.push(userId)
    setRenderTrigger(renderTrigger + 1)
    const url = `/api/projects/${projectId}/cards/${cardId}/users/${userId}`
    const response = await fetch(url, {
      ...defaultFetchOptions,
      method: HTTP_METHODS.POST,
      body: '{}'
    })
    if (!response.ok) {
      card.userIds = card.userIds.filter(id => id !== userId)
      setRenderTrigger(renderTrigger + 1)
    }
  }

  const onUserRemove = async (userId: string): Promise<void> => {
    card.userIds = card.userIds ?? []
    card.userIds = card.userIds.filter(id => id !== userId)
    setRenderTrigger(renderTrigger + 1)
    const url = `/api/projects/${projectId}/cards/${cardId}/users/${userId}`
    const response = await fetch(url, {
      ...defaultFetchOptions,
      method: HTTP_METHODS.DELETE,
      body: '{}'
    })
    if (!response.ok) {
      await responseHandler(response)
    }
  }

  const fetchComments = async (question?: Partial<DisplayQuestion>): Promise<void> => {
    const url = question != null
      ? `/api/projects/${projectId}/cards/${cardId}/questions/${question.id}/comments`
      : `/api/projects/${projectId}/cards/${cardId}/comments`
    const response = await fetch(url, {
      ...defaultFetchOptions,
      method: HTTP_METHODS.GET
    })
    if (response.ok) {
      const comments = await response.json()
      comments.sort((a, b) => a.createdAt - b.createdAt).reverse()
      if (question != null) question.comments = comments
      else {
        card.questions.forEach((q: DisplayQuestion) => {
          q.comments = comments.filter(c => c.questionId === q.id)
        })
      }
    }
  }

  const saveCard = async (data: Partial<Card>): Promise<void> => {
    setIsLoading(true)
    const url = `/api/projects/${projectId}/cards/${cardId}`
    const response = await fetch(url, {
      ...defaultFetchOptions,
      method: HTTP_METHODS.PATCH,
      body: JSON.stringify(data)
    })
    if (response.ok) {
      Object.keys(data).forEach(key => {
        card[key] = data[key]
      })
    } else {
      await responseHandler(response)
    }
    setIsLoading(false)
  }

  const setDate = (date: Date | null | number): void => {
    card.dueDate = typeof date === 'number' ? new Date(date) : date
    void saveCard({ dueDate: card.dueDate })
  }

  const setStage = (stage: CardStage): void => {
    if (card.stage === stage) return
    card.stage = stage
    void saveCard({ stage })
  }

  useEffect(() => {
    if (isOpen) void fetchComments()
  }, [isOpen])

  const deleteComment = async (comment: Comment, question: DisplayQuestion): Promise<void> => {
    setIsLoading(true)
    const url = `/api/projects/${projectId}/cards/${cardId}/questions/${question.id}/comments/${comment._id}`
    const response = await fetch(url, {
      ...defaultFetchOptions,
      method: HTTP_METHODS.DELETE,
      body: '{}'
    })
    if (response.ok) {
      const deletedComment = await response.json()
      question.comments = question.comments ?? []
      question.comments = question.comments.map(c => c._id === comment._id ? deletedComment : c)
      setRenderTrigger(renderTrigger + 1)
    } else {
      await responseHandler(response)
    }
    setIsLoading(false)
  }

  const recalculateEnableing = (): void => {
    if (Array.isArray(card?.questions)) {
      questionEnabler(card?.questions)
    }
  }

  useEffect(recalculateEnableing, [card._id, card?.questions])

  return (
    <Modal size='xl' onClose={onClose} isOpen={isOpen} isCentered>
      <ModalOverlay maxHeight='100vh' />
      {/* https://github.com/chakra-ui/chakra-ui/discussions/2676 */}
      <ModalContent maxW='64rem' overflow='hidden' minHeight='50vh' maxHeight={['100vh', '90vh']} position='relative'>
        <ModalBody p='0' height='100%' display='flex' width='100%' overflowY='scroll' position='relative'>
          <Flex flexDirection='column' height='100%' width='100%' justifyContent='space-between'>
            <Box display='flex'>
              <Box width='100%' marginTop='2rem' ml='4'>
                <Box ml='-4' position='relative'>
                  <Box width='4px' bgColor='var(--main-blue)' borderRightRadius='15px' height='100%' position='absolute' left='0' top='0' />
                  <Text fontSize={[16, 20]} fontWeight='400' px='4'>
                    {card.TOCnumber} {card.title.replace(/=g(b|e)=/g, '')}
                  </Text>
                </Box>
                <Box>
                  <Text fontSize={[16, 20]} color='var(--text-gray)' fontWeight='400' px='4'>
                    {card.desc?.replace(/=g(b|e)=/g, '') ?? ''}
                  </Text>
                </Box>

                {card.example != null &&
                  <Accordion allowToggle allowMultiple>
                    {Array.isArray(card.example) && <AccordionItemStyled title='Example' desc={card.example.map((txt, idx) => <p key={idx}>{txt}</p>)} />}
                    {typeof card.example === 'string' && <AccordionItemStyled title='Example' desc={card.example} />}
                    {/* <AccordionItemStyled title='Recommendation' desc={loremIpsum} /> */}
                  </Accordion>}
                {card?.questions?.map((q: DisplayQuestion, index: number) =>
                  <Box key={`${card._id}-${q.id}-${index}`} p={3}>
                    <QuestionComp question={q} onChange={saveQuestion} />
                    <CommentComponent comment={{}} onSave={async (data: Partial<Comment>) => await saveComment({}, data, q)} ml='3' />
                    {q.comments?.map(c => (
                      <CommentComponent key={c._id} comment={c} onSave={async data => await saveComment(c, data, q)} onDelete={async () => await deleteComment(c, q)} ml='3' />
                    ))}
                  </Box>
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
                  <SingleDatepicker name='date-input' date={card.dueDate != null ? new Date(card.dueDate) : null} onDateChange={setDate}>
                    <Flex justifyContent='space-between' alignItems='center'>
                      <Text fontSize='sm' fontWeight='600' w='100%' minH='2'>
                        {card.dueDate != null ? format(new Date(card.dueDate), 'dd MMM yyyy') : 'click to set'}
                      </Text>
                      {card.dueDate != null && <RiDeleteBin6Line color='#C9C9C9' cursor='pointer' onClick={() => setDate(null)} />}
                    </Flex>
                  </SingleDatepicker>
                  <Flex justifyContent='space-between' alignItems='center'>
                    <Text color='var(--main-blue)' fontSize='sm' as='b' mt='3' mb='2'>Assigned to</Text>
                    <UserMenu users={users ?? []} includedUserIds={card.userIds ?? []} onUserAdd={onUserAdd} onUserRemove={onUserRemove} userIdTrigger={renderTrigger}>
                      <FiEdit2 color='#C9C9C9' cursor='pointer' />
                    </UserMenu>
                  </Flex>
                  {assignedUsers.map(user => (
                    <Flex key={user._id} paddingY='1'>
                      <Avatar size='xs' name={getUserDisplayName(user)} src={user.xsAvatar} />
                      <Text fontSize='sm' fontWeight='600' ml='2'>{getUserDisplayName(user)}</Text>
                    </Flex>))}
                  <label>
                    <Text color='var(--main-blue)' fontSize='sm' as='b' mb='2'>Stage</Text>
                    <Select size='xs' value={card.stage ?? CardStage.PREPARATION} onChange={(e) => setStage((e?.target?.value ?? card.stage) as CardStage)}>
                      {STAGE_VALUES.map(stage => <option key={stage} value={stage} style={{ textTransform: 'capitalize' }}>{stage.toLowerCase()}</option>)}
                    </Select>
                  </label>
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
