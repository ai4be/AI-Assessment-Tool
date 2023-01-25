import React, { FC, useContext, useEffect, useState } from 'react'
import { Box, Flex, Text, AvatarGroup, Avatar } from '@chakra-ui/react'
import { Draggable } from 'react-beautiful-dnd'
import ProjectContext from '@/src/store/project-context'
import { fetchUsers, getUserDisplayName } from '@/util/users'
import { Card } from '@/src/types/card'

interface Props {
  showCardDetail: (cardId: string) => void
  cardIndex: number
  card: Card
}

const CardComponent: FC<Props> = ({ cardIndex, showCardDetail, card }) => {
  const projectContext = useContext(ProjectContext)
  const [users, setUsers] = useState<any[]>([])

  useEffect((): void => {
    if (projectContext.project?.userIds != null) {
      void fetchUsers(projectContext.project?.userIds).then(usersData => setUsers(usersData))
    } else {
      setUsers((prevValue) => {
        if (prevValue.length === 0) return prevValue
        return []
      })
    }
  }, [projectContext.project?.userIds])

  const loadAssignedToUser = (): JSX.Element => {
    if (card.userIds == null) return <></>
    const stringUserIds = card.userIds.map(String)
    const assignedUsers = users.filter((user) => stringUserIds.includes(String(user._id)))

    return (
      <Flex justifyContent='flex-end'>
        <AvatarGroup max={5}>
          {assignedUsers.map((user) => (
            <Avatar key={user._id} size='xs' name={getUserDisplayName(user)} src={user.xsAvatar} />
          ))}
        </AvatarGroup>
      </Flex>
    )
  }

  return (
    // https://github.com/atlassian/react-beautiful-dnd/issues/1767
    <Draggable draggableId={card._id} index={cardIndex} key={card._id}>
      {(provided) => (
        <Box
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          m='5px'
          p='10px'
          id={card._id}
          minHeight='80px'
          borderWidth='1px'
          bg='white'
          cursor='pointer'
          borderRadius='md'
          overflow='auto'
          _hover={{
            backgroundColor: 'lightblue'
          }}
          onClick={() => showCardDetail(card._id)}
        >
          <Text fontSize='sm'>{card.TOCnumber} {card.title?.replace(/(=g(b|e)=)/g, '')}</Text>
          {loadAssignedToUser()}
        </Box>
      )}
    </Draggable>
  )
}

export default CardComponent
