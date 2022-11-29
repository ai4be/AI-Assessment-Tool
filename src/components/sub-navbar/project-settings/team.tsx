
import React, { useState, useContext, useEffect } from 'react'
import useSWR from 'swr'
import {
  Box,
  useDisclosure,
  Flex
} from '@chakra-ui/react'
import { RiDeleteBin6Line } from 'react-icons/ri'
import ProjectContext from '@/src/store/project-context'
import { defaultFetchOptions, fetcher } from '@/util/api'
import ConfirmDialog from '../../confirm-dialog'
import InviteModal from '../invite-user/modal'

const InviteModalMemo = React.memo(InviteModal)
const ConfirmDialogMemo = React.memo(ConfirmDialog)

function emptyFn (): void {}

const Team = ({ project }: { project: any }): JSX.Element => {
  const context = useContext(ProjectContext)
  const { data, mutate } = useSWR(`/api/projects/${String(project._id)}/tokens/pending`, fetcher)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [isLoading, setIsLoading] = useState(false)
  const [deleteHandler, setDeleteHandler] = useState<Function>(() => emptyFn)

  const deleteUser = async (user: any): Promise<void> => {
    setIsLoading(true)
    const url = `/api/projects/${String(project._id)}/users/${String(user._id)}`
    const response = await fetch(url, {
      ...defaultFetchOptions,
      method: 'DELETE'
    })
    if (response.ok) {
      context.users = context.users.filter((u: any) => u._id !== user._id)
      project.users = project.users.filter(uid => uid !== user._id)
      context.setProject(project)
    }
    setDeleteHandler(() => emptyFn)
    setIsLoading(false)
  }

  const deleteToken = async (token: any): Promise<void> => {
    setIsLoading(true)
    const url = `/api/projects/${String(project._id)}/tokens/${String(token._id)}`
    const response = await fetch(url, {
      ...defaultFetchOptions,
      method: 'DELETE'
    })
    if (response.ok) await mutate()
    setDeleteHandler(() => emptyFn)
    setIsLoading(false)
  }

  const setDeleteHandlerWrapper = (instance: any, isUser = true): void => {
    async function deleteUserFn (): Promise<any> { await deleteUser(instance) }
    async function deleteTokenFn (): Promise<any> { await deleteToken(instance) }
    console.log('setDeleteHandlerWrapper', isUser, isUser ? deleteUserFn : deleteTokenFn)
    setDeleteHandler(isUser ? () => deleteUserFn : () => deleteTokenFn)
    onOpen()
  }

  const closeHandler = (): void => {
    setDeleteHandler(() => emptyFn)
    onClose()
  }

  return (
    <>
      <Flex flexDirection='column' className='mb-2'>
        {context.users.map((user) => (
          <Flex key={user._id} justifyContent='space-between' alignItems='center'>
            <Box>{user.fullName || user.email}</Box>
            {user._id.toString() !== project.createdBy.toString()
              ? (<RiDeleteBin6Line cursor='pointer' onClick={() => setDeleteHandlerWrapper(user)} color='var(--main-blue)' />)
              : (<></>)}
          </Flex>
        ))}
        {Array.isArray(data) &&
          <>
            <Box className='text-grey mt-2'>Pending Invites</Box>
            <hr className='my-2' />
            {data.map((token) => (
              <Flex key={token._id} justifyContent='space-between' alignItems='center'>
                <Box>{token.email}</Box>
                <RiDeleteBin6Line cursor='pointer' onClick={() => setDeleteHandlerWrapper(token, false)} color='var(--main-blue)' />
              </Flex>
            ))}
          </>}
      </Flex>
      <InviteModalMemo project={project} callback={mutate} />
      {typeof deleteHandler === 'function' && <ConfirmDialogMemo isOpen={isOpen} onClose={closeHandler} confirmHandler={deleteHandler} />}
    </>
  )
}

export default Team
