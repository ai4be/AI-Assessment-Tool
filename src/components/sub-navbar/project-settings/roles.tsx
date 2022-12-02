import React, { useState, useContext, useEffect } from 'react'
import {
  Avatar,
  AvatarGroup,
  Button,
  Input,
  Textarea,
  Box,
  useBreakpointValue,
  useDisclosure,
  Flex
} from '@chakra-ui/react'
import { HiOutlinePencil } from 'react-icons/hi'
import { RiAddCircleLine, RiDeleteBin6Line } from 'react-icons/ri'
import { useRouter } from 'next/router'
import styles from './roles.module.css'
import { defaultFetchOptions } from '@/util/api'
import ProjectContext from '@/src/store/project-context'
import ConfirmDialog from '@/src/components/confirm-dialog'
import { UserMenu } from '@/src/components/user-menu'
import { getUserDisplayName } from '@/util/users-fe'

const UserMenuMemo = React.memo(UserMenu)

export const RoleBox = ({ project, role, deleteRole, saveRole }): JSX.Element => {
  const [isEditing, setIsEditing] = useState(false)
  const [isUserAdd, setIsUserAdd] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [includedUsers, setIncludedUsers] = useState<string[]>([])
  const rows = useBreakpointValue({ base: 2, sm: 5 })
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [name, setName] = useState(role.name)
  const [description, setDescription] = useState(role.description)
  const [userIdTrigger, setUserIdTrigger] = useState(0)
  const { users } = useContext(ProjectContext)

  useEffect(() => {
    if (Array.isArray(users)) {
      const iu: string[] = users.filter(u => role.userIds.includes(u._id))
      setIncludedUsers(iu)
    }
  }, [users, role.userIds, userIdTrigger])

  const setIsEditingWrapper = (value: boolean): void => {
    setIsEditing(value)
    setIsUserAdd(false)
  }
  const setIsUserAddWrapper = (value: boolean): void => {
    setIsEditing(value)
    setIsUserAdd(false)
  }

  const handleSave = async (...args: any[]): Promise<void> => {
    setIsEditingWrapper(false)
    role.name = name
    role.description = description
    await saveRole(role)
  }

  const handleDelete = async (...args: any[]): Promise<void> => deleteRole(role)

  const onUserAdd = async (userId: string): Promise<void> => {
    role.userIds.push(userId)
    setUserIdTrigger(userIdTrigger + 1)
    const url = `/api/projects/${String(project._id)}/roles/${String(role._id)}/users/${userId}`
    const response = await fetch(url, {
      ...defaultFetchOptions,
      method: 'POST',
      body: JSON.stringify({})
    })
    if (!response.ok) {
      role.userIds = role.userIds.filter(id => id !== userId)
      setUserIdTrigger(userIdTrigger + 1)
    }
  }

  const onUserRemove = async (userId: string): Promise<void> => {
    role.userIds = role.userIds.filter(id => id !== userId)
    setUserIdTrigger(userIdTrigger + 1)
    const url = `/api/projects/${String(project._id)}/roles/${String(role._id)}/users/${userId}`
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
    <Box overflow='hidden' width={[200, 350]} height={[120, 168]} border='2px solid var(--main-blue)' borderRadius='15px' boxShadow='0px 4px 25px rgba(0, 0, 0, 0.07)' className='mt-1 p-2'>
      <Flex justifyContent='space-between'>
        <Input
          placeholder='Role name' size={['xs', 'sm']} className={styles.input_class} disabled={!isEditing} border='0' cursor='pointer !important'
          value={name} onChange={(e): void => setName(e.target.value) }
        />
        {!isEditing &&
          <Flex>
            <HiOutlinePencil onClick={() => setIsEditingWrapper(true)} color='var(--main-blue)' cursor='pointer'/>
            <RiDeleteBin6Line onClick={onOpen} color='var(--main-blue)' cursor='pointer' />
          </Flex>
        }
        {isEditing &&
          <Button onClick={handleSave} size='sm' bg='var(--main-blue)' color='white' className='ml-1'>Save</Button>
        }
      </Flex>
      <Textarea
        rows={rows}
        placeholder='Role description' disabled={!isEditing} className={'mt-1 ' + styles.textarea_class} border='0' p='0'
        value={description} onChange={(e): void => setDescription(e.target.value)}
      />
      <Flex justifyContent='space-between'>
        <Box />
        {!isEditing && (
          <Flex>
            <AvatarGroup size='sm' max={5}>
              {includedUsers.map(user => <Avatar key={user._id} name={getUserDisplayName(user)} src={user.xsAvatar} />)}
            </AvatarGroup>
            <UserMenuMemo users={users} includedUserIds={role.userIds} onUserAdd={onUserAdd} onUserRemove={onUserRemove} userIdTrigger={userIdTrigger} />
          </Flex>
        )}
      </Flex>

      <ConfirmDialog isOpen={isOpen} onClose={onClose} confirmHandler={handleDelete} />
    </Box>
  )
}

const Roles = ({ project }): JSX.Element => {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSave = async (role): Promise<void> => {
    setIsLoading(true)
    const url = `/api/projects/${String(project._id)}/roles/${String(role._id)}`

    const response = await fetch(url, {
      ...defaultFetchOptions,
      method: 'PATCH',
      body: JSON.stringify(role)
    })

    if (response.ok) {
      const updatedRole = await response.json()
      project.roles = project.roles.map(r => r._id === role._id ? updatedRole : r)
    }
    setIsLoading(false)
  }

  const deleteRole = async (role: any): Promise<void> => {
    setIsLoading(true)
    const url = `/api/projects/${String(project._id)}/roles/${String(role._id)}`
    const response = await fetch(url, {
      ...defaultFetchOptions,
      method: 'DELETE',
      body: JSON.stringify({ _id: role._id })
    })
    if (response.ok) {
      project.roles = project.roles.filter(r => r._id !== role._id)
    }
    setIsLoading(false)
  }

  const addRole = async (): Promise<void> => {
    setIsLoading(true)
    const data = {
      name: '',
      description: ''
    }
    const url = `/api/projects/${String(project._id)}/roles`

    const response = await fetch(url, {
      ...defaultFetchOptions,
      method: 'POST',
      body: JSON.stringify(data)
    })

    if (response.ok) {
      const newRole = await response.json()
      project.roles = project.roles ?? []
      project.roles.push(newRole)
    }
    setIsLoading(false)
  }

  return (
    <Flex flexDirection='column'>
      {Array.isArray(project.roles) && project.roles.map((role, index) =>
        <RoleBox key={index} role={role} project={project} deleteRole={deleteRole} saveRole={handleSave} setIsLoading={setIsLoading} />)
      }
      <Flex
        width={[200, 350]} height={[120, 168]} boxShadow='0px 4px 25px rgba(0, 0, 0, 0.07)' borderRadius='15px' justifyContent='center' alignItems='center'
        cursor='pointer'
        onClick={addRole}
      >
        <RiAddCircleLine size='30px' color='#C9C9C9' />
      </Flex>
    </Flex>
  )
}

export default Roles
