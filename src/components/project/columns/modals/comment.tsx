import React, {
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react'
import {
  Box,
  Flex,
  Button,
  Avatar,
  Text,
  Grid,
  GridItem,
  useDisclosure
} from '@chakra-ui/react'
import isEmpty from 'lodash.isempty'
import { getUserDisplayName } from '@/util/users-fe'
import { RiDeleteBin6Line } from 'react-icons/ri'
import { Mention, MentionsInput } from 'react-mentions'
import { GiCancel } from 'react-icons/gi'
import UserContext from '@/src/store/user-context'
import ProjectContext from '@/src/store/project-context'
import ConfirmDialog from '@/src/components/confirm-dialog'

function timeAgo (value): string {
  const seconds = Math.floor((new Date().getTime() - new Date(value).getTime()) / 1000)
  let interval = seconds / 31536000
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })
  if (interval > 1) { return rtf.format(-Math.floor(interval), 'year') }
  interval = seconds / 2592000
  if (interval > 1) { return rtf.format(-Math.floor(interval), 'month') }
  interval = seconds / 86400
  if (interval > 1) { return rtf.format(-Math.floor(interval), 'day') }
  interval = seconds / 3600
  if (interval > 1) { return rtf.format(-Math.floor(interval), 'hour') }
  interval = seconds / 60
  if (interval > 1) { return rtf.format(-Math.floor(interval), 'minute') }
  return rtf.format(-Math.floor(interval), 'second')
}

const Comment = ({ comment, onSave, onCancel, onDelete }: { comment: any, onSave?: Function, onCancel?: Function, onDelete?: Function }): JSX.Element => {
  const { users } = useContext(ProjectContext)
  const { user } = useContext(UserContext)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [value, setValue] = useState(comment?.text ?? '')
  const [showEditOptions, setShowEditOptions] = useState(false)
  const [disabled, setDisabled] = useState(false)
  const [usersComment, setUsersComment] = useState(null)
  const mentionsUsers = useMemo(
    () => users?.map(u => ({ id: String(u._id), display: getUserDisplayName(u) }))
      .filter(u => u.id !== user?._id) ?? []
    , [users])

  useEffect(() => {
    if (comment?._id == null) setDisabled(false)
    else setDisabled(String(comment.userId) !== String(user?._id))
  }, [comment?.userId, user?._id])

  useEffect(() => {
    if (comment?._id == null) setUsersComment(user)
    else {
      const userComment = users?.find(u => u._id === comment.userId)
      setUsersComment(userComment)
    }
  }, [comment?.userId, user, users])

  const saveHandler = (e): void => {
    e.preventDefault()
    e.stopPropagation()
    console.log('saveHandler')
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
      fontSize: 'var(--chakra-fontSizes-sm)'
    },
    input: {
      fontSize: 'var(--chakra-fontSizes-sm)'
    }
  }

  return (
    <Grid templateRows='min-content min-content' templateColumns='min-content auto' rowGap='0' _notFirst={{ marginTop: 2 }}>
      <GridItem colSpan={1} />
      <GridItem colSpan={1} display='flex'>
        {comment.createdAt != null && <Text fontSize='xs' color='var(--text-grey)'>{timeAgo(comment.createdAt)}</Text>}
        {comment.updatedAt != null && <Text fontSize='xs' ml='1' textDecoration='underline' color='var(--text-grey)'>(Edited)</Text>}
      </GridItem>
      <GridItem colSpan={1}>
        <Avatar size='xs' name={usersComment != null ? getUserDisplayName(usersComment) : undefined} src={usersComment?.xsAvatar} mr='1' mt='1' />
      </GridItem>
      <GridItem colSpan={1}>
        <Box width='100%' boxShadow='rgb(0 0 0 / 10%) 0 0 10px' borderRadius='0.5rem' padding='2'>
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
          {showEditOptions &&
            <Flex alignItems='center' justifyContent='space-between' mt='1'>
              <Flex alignItems='center'>
                <Button size='sm' colorScheme='blue' disabled={isEmpty(value) || value === comment.text} onClick={saveHandler}>Save</Button>
                <GiCancel size='20px' color='#286cc3' cursor='pointer' className='ml-1' onClick={cancelHandler} />
              </Flex>
              {comment._id != null && <RiDeleteBin6Line cursor='pointer' color='#286cc3' onClick={onOpen} />}
            </Flex>}
        </Box>
      </GridItem>
      <ConfirmDialog isOpen={isOpen} onClose={onClose} confirmHandler={(e) => onDelete != null ? onDelete(comment) : null} />
    </Grid>
  )
}

export default Comment
