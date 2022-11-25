import React, { useState, useCallback } from 'react'
import {
  Box,
  Button,
  Heading,
  Input
} from '@chakra-ui/react'
import Cards from '@/src/components/project/columns/cards'
import { Droppable, Draggable } from 'react-beautiful-dnd'
import debounce from 'lodash.debounce'
import { CardDetail } from '@/src/types/cards'
import { addCard } from '@/util/cards'
import { useSession } from 'next-auth/react'
import {
  updateColumn
} from '@/util/columns'

const Column = ({ showCardDetail, column, index, id, cards, projectId, fetchColumns, fetchCards }): JSX.Element => {
  const { data } = useSession()
  const [showEditBox, setEditBoxVisibility] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const user: any = data?.user

  const [columnName, setColumnName] = useState<string>(column.name)
  const cardsInSortedSequence = cards.sort(
    (cardA: CardDetail, cardB: CardDetail) => cardA.sequence - cardB.sequence
  )

  const loadColumnTitle = (): JSX.Element => {
    if (showEditBox) {
      return (
        <Input
          bg='white'
          value={columnName}
          size='xs'
          width='60%'
          ml='20px'
          onChange={handleChange}
          onBlur={() => setEditBoxVisibility(false)}
          onKeyDown={handleKeyDown}
        />
      )
    }

    return (
      <Heading as='h6' size='sm' ml='10px' mt='5px' textAlign='center' className='text-grey uppercase'>
        {columnName}
      </Heading>
    )
  }

  const handleKeyDown = (e): void => {
    if (e.keyCode === 13) {
      e.preventDefault()
      setEditBoxVisibility(false)
    }
  }

  const handleCardAdd = async (): Promise<void> => {
    setIsLoading(true)
    await addCard(id, projectId, user.id, cards)
    await fetchCards()
    setIsLoading(false)
  }

  const handleChange = (e): void => {
    setColumnName(e.target.value)
    handleColumnNameChange(e.target.value)
  }

  // const handleColumnDelete = async (): Promise<void> => {
  //   setIsLoading(true)
  //   await deleteColumn(id, projectId)
  //   await fetchColumns()
  //   setIsLoading(false)
  // }

  const handleColumnNameChange = useCallback(
    debounce(async (value) => await nameChange(value), 800),
    []
  )

  const nameChange = async (value): Promise<void> => {
    setIsLoading(true)
    const data = {
      name: value,
      columnId: column._id,
      projectId
    }
    await updateColumn(data)
    setIsLoading(false)
  }

  return (
    <Box
      key={index}
      width='272px'
      height='calc(100vh - 90px)'
      overflowY='auto'
      mt='10px'
      mr='10px'
      ml={index === 0 ? '0' : '10px'}
      className='background-light-blue rounded-lg'
    >
      <Box pb='5px' rounded='lg'>
        <Box display='flex' alignItems='center' justifyContent='center' className='mt-1.5'>
          {loadColumnTitle()}
        </Box>
        <Droppable droppableId={column._id} type='card'>
          {(provided) => (
            // 2px height is needed to make the drop work when there is no card.
            <Box ref={provided.innerRef} {...provided.droppableProps} minHeight='2px'>
              <Cards showCardDetail={showCardDetail} cards={cardsInSortedSequence} />
              {provided.placeholder}
            </Box>
          )}
        </Droppable>
        <Button
          size='xs'
          my='10px'
          mx='auto'
          width='80%'
          color='black'
          variant='ghost'
          disabled={isLoading}
          isLoading={isLoading}
          display='flex'
          loadingText='Adding card'
          onClick={handleCardAdd}
        >
          + Add a card
        </Button>
      </Box>
    </Box>
  )
}

export default Column
