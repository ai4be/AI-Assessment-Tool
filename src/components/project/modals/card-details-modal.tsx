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
import ProjectContext from '@/src/store/project-context'
import { getUserDisplayName } from '@/util/users'
import { defaultFetchOptions, HTTP_METHODS, getResponseHandler } from '@/util/api'
import { SingleDatepicker } from '@/src/components/date-picker'
import { FiEdit2 } from 'react-icons/fi'
import { format } from 'date-fns'
import { UserMenu } from '@/src/components/user-menu'
import { questionEnabler } from '@/util/question'
import { DisplayQuestion, Card, CardStage, DisplayCard, STAGE_VALUES } from '@/src/types/card'
import ToastContext from '@/src/store/toast-context'
import QuestionAndComments from '@/src/components/project/modals/question-and-comments'
import { Comment } from '@/src/types/comment'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'

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
}

const CardDetailsModal: FC<Props> = ({ onClose, isOpen, card }) => {
  const { t } = useTranslation()
  const router = useRouter()
  card.userIds = card?.userIds ?? []
  const cardId = String(card._id)
  const projectId = String(card.projectId)
  const { question: questionId, comment: commentId } = router.query
  const [scoredQuestions, setScoredQuestions] = useState<DisplayQuestion[]>([])
  const [unscoredQuestions, setUnscoredQuestions] = useState<DisplayQuestion[]>([])
  const [unscoredQuestionsCollapsed, setUnscoredQuestionsCollapsed] = useState<boolean>(true)
  const [commentsFetched, setCommentsFetched] = useState<boolean>(false)

  const fetchComments = async (question?: Partial<DisplayQuestion>): Promise<void> => {
    const url = question != null
      ? `/api/projects/${projectId}/cards/${cardId}/questions/${String(question.id)}/comments`
      : `/api/projects/${projectId}/cards/${cardId}/comments`
    const response = await fetch(url, {
      ...defaultFetchOptions,
      method: HTTP_METHODS.GET
    })
    if (response.ok) {
      const comments: Comment[] = await response.json()
      comments.sort((a, b) => +a.createdAt - +b.createdAt).reverse()
      if (question != null) question.comments = comments
      else {
        card.questions.forEach((q: DisplayQuestion) => {
          q.comments = comments.filter(c => c.questionId === q.id)
        })
      }
      setCommentsFetched(true)
    }
  }

  useEffect(() => {
    if (isOpen) void fetchComments()
  }, [isOpen])

  const recalculateEnableing = (): void => {
    if (Array.isArray(card?.questions)) questionEnabler(card?.questions)
  }

  useEffect(recalculateEnableing, [card._id, card?.questions])

  useEffect(() => {
    if (Array.isArray(card?.questions)) {
      setScoredQuestions(card.questions.filter(q => q.isScored === 1 || q.isScored === true))
      setUnscoredQuestions(card.questions.filter(q => q.isScored === 0 || q.isScored === false))
    }
  }, [card.questions])

  useEffect(() => {
    if ((questionId != null || commentId != null) && Array.isArray(unscoredQuestions)) {
      if (questionId != null && unscoredQuestions.find(q => q.id === questionId) != null) {
        setUnscoredQuestionsCollapsed(false)
      } else if (commentId != null) {
        const question = unscoredQuestions.find(q => q.comments?.find(c => c._id === commentId) != null)
        if (question != null) {
          setUnscoredQuestionsCollapsed(false)
        }
      }
    }
  }, [unscoredQuestions, questionId, commentsFetched])

  return (
    <Modal size='xl' onClose={onClose} isOpen={isOpen} isCentered>
      <ModalOverlay maxHeight='100%' />
      {/* https://github.com/chakra-ui/chakra-ui/discussions/2676 */}
      <ModalContent maxW='64rem' overflow='hidden' minHeight='50vh' maxHeight={['100vh', '90vh']} position='relative' mr='2' ml='2'>
        <ModalBody p='0' height='100%' display='flex' width='100%' overflowY='scroll' position='relative'>
          <Flex flexDirection='column' height='100%' width='100%' justifyContent='space-between'>
            <Box display='flex'>
              <Box width='100%' marginTop='2rem' marginX='4'>
                <Box ml='-4' position='relative'>
                  <Box width='4px' bgColor='var(--main-blue)' borderRightRadius='15px' height='100%' position='absolute' left='0' top='0' />
                  <Text fontSize={[16, 20]} fontWeight='400' px='4'>
                    {card.TOCnumber} {card.title.replace(/=g(b|e)=/g, '')}
                  </Text>
                </Box>
                {card.example != null &&
                  <Accordion allowToggle allowMultiple>
                    {Array.isArray(card.example) && <AccordionItemStyled title={`${t('titles:example')}`} desc={card.example.map((txt, idx) => <p key={idx}>{txt}</p>)} />}
                    {typeof card.example === 'string' && <AccordionItemStyled title={`${t('titles:example')}`} desc={card.example} />}
                    {/* <AccordionItemStyled title='Recommendation' desc={loremIpsum} /> */}
                  </Accordion>}

                <Accordion defaultIndex={0} allowToggle borderRadius='lg' className='shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)]' border='1px solid var(--main-blue)' marginY='1rem'>
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
                      display='flex' alignItems='center' justifyContent='space-between' boxShadow='none'
                      _hover={{
                        boxShadow: 'none',
                        border: 'none'
                      }}
                      _focus={{ boxShadow: 'none !important' }}
                    >
                      <Text fontSize={[12, 16]} color='var(--text-gray)' fontWeight='200' px='4' display='inline'>
                        The following questions will help you in your evaluation
                      </Text>
                      <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel pb={4} border='none'>
                      {unscoredQuestions.map((q: DisplayQuestion, index: number) =>
                        <QuestionAndComments key={`${cardId}-${q.id}-${index}`} p={3} question={q} cardId={cardId} projectId={projectId} questionSaveCallback={recalculateEnableing} />)}
                    </AccordionPanel>
                  </AccordionItem>
                </Accordion>
                {scoredQuestions?.length > 0 &&
                  <Box marginBottom='1rem' borderRadius='lg' className='shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)]' border='1px solid var(--main-blue)' paddingY='1rem'>
                    {scoredQuestions.map((q: DisplayQuestion, index: number) =>
                      <QuestionAndComments key={`${cardId}-${q.id}-${index}`} p={3} question={q} cardId={cardId} projectId={projectId} questionSaveCallback={recalculateEnableing} />)}
                  </Box>}
              </Box>
              <Sidebar card={card} />
            </Box>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default CardDetailsModal

const Sidebar = ({ card }: { card: Card }): JSX.Element => {
  const { t } = useTranslation()
  const cardId = String(card._id)
  const projectId = String(card.projectId)
  const { showToast } = useContext(ToastContext)
  const [renderTrigger, setRenderTrigger] = useState(0)
  const responseHandler = getResponseHandler(showToast)
  const [assignedUsers, setAssignedUsers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { users } = useContext(ProjectContext)

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

  useEffect(() => {
    const userIds = card.userIds ?? []
    setAssignedUsers(users?.filter(user => userIds.includes(user._id)) ?? [])
  }, [card.userIds, renderTrigger])

  return (
    <Flex flexDirection='column' minWidth='241px' backgroundColor='#FAFAFA' justifyContent='space-between' p={3} pt='0'>
      <Box position='sticky' top='0'>
        <Flex flexDirection='column'>
          <Flex justifyContent='flex-end'>
            <ModalCloseButton position='relative' />
          </Flex>
          <Flex justifyContent='space-between' alignItems='center'>
            <Text color='var(--main-blue)' fontSize='sm' as='b' mb='2'>{t('sidebar:due-date')}</Text>
          </Flex>
          <SingleDatepicker name='date-input' date={card.dueDate != null ? new Date(card.dueDate) : null} onDateChange={setDate}>
            <Flex justifyContent='space-between' alignItems='center'>
              <Text fontSize='sm' fontWeight='600' w='100%' minH='2'>
                {card.dueDate != null ? format(new Date(card.dueDate), 'dd MMM yyyy') : `${t('sidebar:define')}`}
              </Text>
              {card.dueDate != null && <RiDeleteBin6Line color='#C9C9C9' cursor='pointer' onClick={() => setDate(null)} />}
            </Flex>
          </SingleDatepicker>
          <Flex justifyContent='space-between' alignItems='center'>
            <Text color='var(--main-blue)' fontSize='sm' as='b' mt='3' mb='2'>{t('sidebar:assigned-to')}</Text>
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
            <Text color='var(--main-blue)' fontSize='sm' as='b' mb='2'>{t('sidebar:stage')}</Text>
            <Select size='xs' value={card.stage ?? CardStage.DEVELOPMENT} onChange={(e) => setStage((e?.target?.value ?? card.stage) as CardStage)}>
              {STAGE_VALUES.map(stage => <option key={stage} value={stage} style={{ textTransform: 'capitalize' }}>{stage.toLowerCase()}</option>)}
            </Select>
          </label>
        </Flex>
      </Box>
    </Flex>
  )
}
