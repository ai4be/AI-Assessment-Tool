import React, { FC, useContext } from 'react'
import { Box, Flex, Text, AvatarGroup, Avatar } from '@chakra-ui/react'
import { Draggable } from 'react-beautiful-dnd'
import ProjectContext from '@/src/store/project-context'
import { getUserDisplayName } from '@/util/users'
import { Card } from '@/src/types/card'

interface Props {
  showCardDetail: (cardId: string) => void
  cardIndex: number
  card: Card
}

const CardComponent: FC<Props> = ({ cardIndex, showCardDetail, card }) => {
  const { nonDeletedUsers = [] } = useContext(ProjectContext)

  const loadAssignedToUser = (): JSX.Element => {
    if (card.userIds == null) return <></>
    const stringUserIds = card.userIds.map(String)
    const assignedUsers = nonDeletedUsers.filter(user => stringUserIds.includes(user._id))

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

  const Draggable2 = Draggable as any // ugly hack to get around typescript error

  return (
    // https://github.com/atlassian/react-beautiful-dnd/issues/1767
    <Draggable2 draggableId={card._id} index={cardIndex} key={card._id}>
      {(provided: any) => (
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
    </Draggable2>
  )
}

export default CardComponent
