import React, {
  useContext,
  useEffect,
  useMemo,
  useState,
  useRef
} from 'react'
import {
  Box,
  Flex,
  Button,
  Avatar,
  Text,
  Grid,
  GridItem,
  useDisclosure,
  GridProps
} from '@chakra-ui/react'
import { isEmpty, timeAgo } from '@/util/index'
import { getUserDisplayName } from '@/util/users'
import { RiDeleteBin6Line } from 'react-icons/ri'
import { Mention, MentionsInput } from 'react-mentions'
import { GiCancel } from 'react-icons/gi'
import UserContext from '@/src/store/user-context'
import ProjectContext from '@/src/store/project-context'
import ConfirmDialog from '@/src/components/confirm-dialog'
import { User } from '@/src/types/user'
import { useRouter } from 'next/router'
import { Comment } from '@/src/types/comment'
import { format } from 'date-fns'

type CommentProps = {
  comment: Partial<Comment>
  onSave?: Function
  onCancel?: Function
  onDelete?: Function
} & GridProps

const CommentComponent = ({ comment, onSave, onCancel, onDelete, ...rest }: CommentProps): JSX.Element => {
  const router = useRouter()
  const { comment: commentId } = router.query
  const commentElement = useRef<HTMLDivElement>(null) // to be able to access the current one
  const { users } = useContext(ProjectContext)
  const { user } = useContext(UserContext)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [value, setValue] = useState(comment?.text ?? '')
  const [showEditOptions, setShowEditOptions] = useState(false)
  const [disabled, setDisabled] = useState(false)
  const [usersComment, setUsersComment] = useState<null | User>(null)
  const mentionsUsers = useMemo(
    () => users?.map(u => ({ id: String(u._id), display: getUserDisplayName(u) }))
      .filter(u => u.id !== user?._id) ?? []
    , [users])

  useEffect(() => {
    if (commentElement?.current != null && commentId != null && commentId === comment._id) {
      setTimeout(() => commentElement.current?.scrollIntoView({ behavior: 'smooth' }), 400)
    }
  }, [])

  useEffect(() => {
    if (comment?._id == null) setDisabled(false)
    else setDisabled(comment.userId !== user?._id)
  }, [comment?.userId, user?._id])

  useEffect(() => {
    if (comment?._id == null) setUsersComment(user)
    else {
      const userComment = users?.find(u => u._id === comment.userId)
      setUsersComment(userComment)
    }
  }, [comment?.userId, user, users])

  const saveHandler = (e: any): void => {
    e.preventDefault()
    e.stopPropagation()
    const val = value.trim().replace(/\n+$/, '')
    if (onSave != null) onSave({ text: val })
    if (comment._id == null) setValue('')
    else setValue(val)
    setShowEditOptions(false)
  }

  const cancelHandler = (): void => {
    setValue(comment?.text ?? '')
    onCancel != null && onCancel({ text: value }) // eslint-disable-line @typescript-eslint/prefer-optional-chain
    setShowEditOptions(false)
  }

  const style = {
    control: {
      fontSize: 'var(--chakra-fontSizes-xs)'
    },
    input: {
      fontSize: 'var(--chakra-fontSizes-xs)'
    }
  }

  return (
    <Grid templateRows='min-content min-content' templateColumns='min-content auto' rowGap='0' _notFirst={{ marginTop: 2 }} ref={commentElement} {...rest}>
      <GridItem colSpan={1} />
      <GridItem colSpan={1} display='flex'>
        {comment.createdAt != null && <Text fontSize='xs' color='var(--text-grey)'>{timeAgo(comment.createdAt)}</Text>}
        {comment.updatedAt != null && <Text fontSize='xs' ml='1' textDecoration='underline' color='var(--text-grey)'>(Edited)</Text>}
      </GridItem>
      <GridItem colSpan={1}>
        {usersComment != null && <Avatar size='xs' name={getUserDisplayName(usersComment)} src={usersComment?.xsAvatar} mr='1' mt='1' />}
      </GridItem>
      <GridItem colSpan={1}>
        <Box width='100%' boxShadow='rgb(0 0 0 / 10%) 0 0 10px' borderRadius='0.5rem' padding='2'>
          {comment.deletedAt == null &&
            <>
              <MentionsInput
                style={style}
                disabled={disabled}
                value={value}
                onFocus={() => setShowEditOptions(true)}
                onBlur={(e, isFromSuggestion: boolean) => {
                  // console.log(e)
                  // !isFromSuggestion ? setShowEditOptions(false) : null
                }}
                onChange={(e) => setValue(e.target.value)}
                placeholder='Write a comment'
                className='mentions'
                a11ySuggestionsListLabel='Suggested mentions'
              >
                <Mention trigger='@' data={mentionsUsers} className='mentions__mention' appendSpaceOnAdd displayTransform={(id, display) => `@${display}`} />
              </MentionsInput>
              {showEditOptions && <EditOptions comment={comment} value={value} saveHandler={saveHandler} cancelHandler={cancelHandler} onOpen={onOpen} />}
            </>}
          {comment.deletedAt != null && <Text fontSize='xs' color='var(--text-grey)'>Comment deleted on {format(new Date(comment.deletedAt), 'dd MMM yyyy')}</Text>}
        </Box>
      </GridItem>
      <ConfirmDialog isOpen={isOpen} onClose={onClose} confirmHandler={(e) => onDelete != null ? onDelete(comment) : null} />
    </Grid>
  )
}

export default CommentComponent

interface EditOptionsProps {
  comment: Partial<Comment>
  value: string
  saveHandler: (e: any) => void
  cancelHandler: (e: any) => void
  onOpen: () => void
}

const EditOptions = ({ comment, value, saveHandler, cancelHandler, onOpen }: EditOptionsProps): JSX.Element => (
  <Flex alignItems='center' justifyContent='space-between' mt='1'>
    <Flex alignItems='center'>
      <Button size='sm' colorScheme='blue' disabled={isEmpty(value) || value === comment.text} onClick={saveHandler}>Save</Button>
      <GiCancel size='20px' color='#286cc3' cursor='pointer' className='ml-1' onClick={cancelHandler} />
    </Flex>
    {comment._id != null && <RiDeleteBin6Line cursor='pointer' color='#286cc3' onClick={onOpen} />}
  </Flex>
)
