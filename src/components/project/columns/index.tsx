import React, { useState, FC, useEffect } from 'react'
import { Box, useDisclosure } from '@chakra-ui/react'
import AddColumnButton from '@/src/components/project/columns/buttons/add-column-button'
import CardDetailsModal from '@/src/components/project/columns/modals/card-details-modal'
import Column from '@/src/components/project/columns/column'
import { CardDetail } from '@/src/types/cards'
import shortId from 'shortid'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import useSWR from 'swr'
import { updateCard } from '@/util/cards'
import { updateColumn } from '@/util/columns'
import { fetcher } from '@/util/api'
// import useRenderingTrace from '@/src/hooks'

interface IProps {
  projectId: string
  session: any
}

const ProjectColumns: FC<IProps> = ({ projectId, session }: { projectId: string, session: any }): JSX.Element => {
  const { data, error, mutate } = useSWR(`/api/projects/${projectId}/columns`, fetcher)
  const { data: dataCards, error: errorCards, mutate: mutateCards } = useSWR(`/api/projects/${projectId}/cards`, fetcher)

  const { isOpen, onOpen, onClose } = useDisclosure()
  const [cardDetail, setCardDetail] = useState<CardDetail>({ _id: '', title: '', description: '' })

  const [columns, setColumns] = useState<any[]>([])
  const [cards, setCards] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  // useRenderingTrace('ProjectColumns', { projectId, session, columns, cards, isLoading, cardDetail }, 'log')

  useEffect(() => {
    if (Array.isArray(data)) {
      setColumnsSorted(data)
    } else {
      setColumns([])
    }
  }, [data])
  useEffect(() => setCards(dataCards || []), [dataCards])

  const setColumnsSorted = (cols: any[]): void => {
    cols.sort((a, b) => a.sequence - b.sequence)
    setColumns(cols)
  }

  const showCardDetail = (cardId: string): void => {
    const card = cards.filter((card) => card._id === cardId)
    setCardDetail(card[0])
    onOpen()
  }

  const addColumn = async (): Promise<void> => {
    setIsLoading(true)
    const columnId = shortId.generate()
    const { user } = session
    const columsArray = columns
    let sequence = 1
    if (columns.length > 0) {
      sequence = columsArray[columsArray.length - 1].sequence + 1
    }
    const data = {
      id: columnId,
      projectId,
      columnName: 'Add title',
      dateCreated: new Date().toLocaleString(),
      userId: user.id,
      sequence
    }

    const response = await fetch(`/api/projects/${data.projectId}/columns`, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json'
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: JSON.stringify(data)
    })

    const inJSON = await response.json()
    await mutate()
    setIsLoading(false)
  }

  const filterCards = (columnId: string): any[] => {
    return cards.filter(card => card.columnId === columnId)
  }

  const onDragEnd = async (result): Promise<void> => {
    const { destination, source, draggableId, type } = result
    // Don't do anything where there is not destination
    if (destination == null) return
    // Do nothing if the card is put back where it was
    if (destination.droppableId === source.droppableId && destination.index === source.index) return
    // If card is being dragged
    if (type === 'card') {
      return await saveCardSequence(destination.index, destination.droppableId, draggableId)
    }
    // If column is being dragged
    if (type === 'column') {
      return await saveColumnSequence(destination.index, draggableId)
    }
  }

  const saveCardSequence = async (destinationIndex: number, destinationColumnId: string, cardId: string): Promise<void> => {
    const cardsFromColumn: any[] = cards.filter(
      (card) => card.columnId === destinationColumnId && card._id !== cardId
    )
    const sortedCards = cardsFromColumn.sort((a, b) => a.sequence - b.sequence)
    let sequence = +(destinationIndex === 0 ? 1 : sortedCards[destinationIndex - 1].sequence + 1)

    const patchCard = {
      _id: cardId,
      sequence,
      columnId: destinationColumnId
    }
    const cardToPatch: any = cards.find(card => card._id === cardId)
    if (cardToPatch == null) return
    cardToPatch.sequence = sequence
    cardToPatch.columnId = destinationColumnId
    const promises: Array<Promise<any>> = [updateCard(patchCard, projectId)]
    for (let i = destinationIndex; i < sortedCards.length; i++) {
      const card = sortedCards[i]
      sequence += 1
      card.sequence = sequence

      const patchCard = {
        _id: card._id,
        sequence,
        columnId: destinationColumnId
      }
      promises.push(updateCard(patchCard, projectId))
    }
    setCards([...cards])
    await Promise.all(promises)
    // await mutateCards()
  }

  const saveColumnSequence = async (destinationIndex: number, columnId: string): Promise<void> => {
    // Remove the column which is dragged from the list
    const filteredColumns: any[] = columns.filter((column) => column._id !== columnId)
    const sortedColumns = filteredColumns.sort((a, b) => a.sequence - b.sequence)
    let sequence = +(destinationIndex === 0 ? 1 : sortedColumns[destinationIndex - 1].sequence + 1)

    const column = columns.find(c => c._id === columnId)
    if (column == null) return
    column.sequence = sequence
    const promises: Array<Promise<any>> = [updateColumn({ columnId, projectId, sequence })]
    for (let i = destinationIndex; i < sortedColumns.length; i++) {
      const column = sortedColumns[i]
      sequence += 1
      column.sequence = sequence
      const patchColumn = {
        columnId: column._id,
        sequence,
        projectId
      }
      promises.push(updateColumn(patchColumn))
    }
    setColumnsSorted([...columns])
    await Promise.all(promises)
    // await mutate()
  }

  return (
    <Box display='block' position='relative' height='calc(100vh - 90px)' overflowX='auto'>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId='all-collumns' direction='horizontal' type='column'>
          {(provided) => (
            <Box
              ref={provided.innerRef}
              {...provided.droppableProps}
              display='flex'
              position='absolute'
              overflowY='auto'
            >
              {Array.isArray(columns) && columns.map((column, index) => (
                <Column
                  key={column._id}
                  column={column}
                  id={column._id}
                  index={index}
                  cards={filterCards(column._id)}
                  showCardDetail={showCardDetail}
                  projectId={projectId}
                  fetchColumns={mutate}
                  fetchCards={mutateCards}
                />
              ))}
              {provided.placeholder}
              <AddColumnButton addColumn={addColumn} />
            </Box>
          )}
        </Droppable>
      </DragDropContext>
      {isOpen && <CardDetailsModal isOpen={isOpen} onClose={onClose} card={cardDetail} projectId={projectId} fetchCards={mutateCards} />}
    </Box>
  )
}

export default ProjectColumns
