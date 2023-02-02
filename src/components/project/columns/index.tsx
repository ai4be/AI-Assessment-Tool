import React, { useState, FC, useEffect } from 'react'
import { Box, useDisclosure } from '@chakra-ui/react'
import CardDetailsModal from '@/src/components/project/modals/card-details-modal'
import ColumnComponent from '@/src/components/project/columns/column'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import useSWR from 'swr'
import { updateCard } from '@/util/cards'
import { fetcher } from '@/util/api'
import { useRouter } from 'next/router'
import ProjectBar from '@/src/components/project/project-bar'
import { CardStage, Card } from '@/src/types/card'
import { isEmpty } from '@/util/index'
import { Assignment, DueDate, QueryFilterKeys } from '../project-bar/filter-menu'
import { Column } from '@/src/types/column'
import { useQueryCardId } from '@/src/hooks/index'
import { Project } from '@/src/types/project'

interface IProps {
  project: Project
}

// defined to avoid style issues while columns are loading
const dummyData = { projectId: '', createdAt: new Date(), createdBy: '' }
const defaultColumns: Column[] = [
  { _id: '1', name: 'TO DO', ...dummyData },
  { _id: '2', name: 'BUSY', ...dummyData },
  { _id: '3', name: 'DONE', ...dummyData }
]

const ProjectColumns: FC<IProps> = ({ project }): JSX.Element => {
  const router = useRouter()
  const projectId = String(project?._id)
  const {
    [QueryFilterKeys.CATEGORY]: categoryId,
    [QueryFilterKeys.STAGE]: stage,
    [QueryFilterKeys.ASSIGNED_TO]: assignedTo,
    [QueryFilterKeys.DUE_DATE]: dueDate,
    [QueryFilterKeys.ASSIGNMENT]: assignment
  } = router.query
  const { data, error, mutate } = useSWR(`/api/projects/${projectId}/columns`, fetcher)
  const { data: dataCards, error: errorCards, mutate: mutateCards } = useSWR(`/api/projects/${projectId}/cards`, fetcher)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [columns, setColumns] = useState<Column[]>(defaultColumns)
  const [cards, setCards] = useState<Card[]>([])
  const { card, setCardQuery, unSetCardQuery } = useQueryCardId(cards, () => onOpen(), () => onClose())

  // useRenderingTrace('ProjectColumns', { projectId, session, columns, cards, isLoading, cardDetail }, 'log')

  useEffect(() => {
    if (Array.isArray(data)) {
      setColumnsSorted(data)
    } else {
      setColumns(defaultColumns)
    }
  }, [data])

  useEffect(() => {
    setCards(dataCards ?? [])
  }, [dataCards])

  const setColumnsSorted = (cols: any[]): void => {
    cols.sort((a, b) => a.sequence - b.sequence)
    setColumns(cols)
  }

  const filterCardsArrayFn = (card: any, columnId: string): boolean => {
    let val = String(card.columnId) === columnId
    if (val && categoryId != null) val = card.category === categoryId
    if (val && stage != null) {
      val = card.stage === stage || (stage === CardStage.PREPARATION && isEmpty(card.stage))
    }
    if (val && assignedTo != null && assignedTo?.length > 0) {
      const fileterUserIds = typeof assignedTo === 'string' ? [assignedTo] : assignedTo
      const assignedToArr = card.userIds?.map(uid => String(uid)) ?? []
      val = fileterUserIds.some(uid => assignedToArr.includes(uid))
    }
    if (val && dueDate != null) {
      val = dueDate === DueDate.NOT_SET ? isEmpty(card.dueDate) : !isEmpty(card.dueDate)
    }
    if (val && assignment != null && assignment !== Assignment.ASSIGNED_TO) {
      val = assignment === Assignment.UNASSIGNED ? isEmpty(card.userIds) : !isEmpty(card.userIds)
    }
    return val
  }

  const filterCards = (columnId: string): any[] => {
    columnId = String(columnId)
    return cards.filter(card => filterCardsArrayFn(card, columnId))
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
  }

  const saveCardSequence = async (destinationIndex: number, destinationColumnId: string, cardId: string): Promise<void> => {
    const cardsFromColumn: Card[] = cards.filter(
      (card) => card.columnId === destinationColumnId && card._id !== cardId
    )
    const sortedCardsFromColumn = cardsFromColumn.sort((a, b) => a.sequence - b.sequence)
    let sequence = +(destinationIndex === 0 ? 1 : sortedCardsFromColumn[destinationIndex - 1].sequence + 1)

    const patchCard: any = {
      _id: cardId,
      sequence
    }
    const cardToPatch: any = cards.find(card => card._id === cardId)
    if (cardToPatch == null) return
    cardToPatch.sequence = sequence
    if (String(cardToPatch.columnId) !== String(destinationColumnId)) {
      cardToPatch.columnId = destinationColumnId
      patchCard.columnId = destinationColumnId
    }
    const promises: Array<Promise<any>> = [updateCard(patchCard, project?._id)]
    for (const card of sortedCardsFromColumn) {
      sequence += 1
      card.sequence = sequence

      const patchCard = {
        _id: card._id,
        sequence
      }
      promises.push(updateCard(patchCard, project?._id))
    }
    setCards([...cards])
    await Promise.all(promises)
    // await mutateCards()
  }

  return (
    <Box>
      <ProjectBar project={project} />
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId='all-collumns' direction='horizontal' type='column'>
          {(provided) => (
            <Box ref={provided.innerRef} {...provided.droppableProps} display='flex'>
              {Array.isArray(columns) && columns.map((column, index) => (
                <ColumnComponent
                  key={column._id}
                  column={column}
                  id={column._id}
                  index={index}
                  cards={filterCards(column._id)}
                  showCardDetail={setCardQuery}
                  projectId={project?._id}
                  fetchColumns={mutate}
                  fetchCards={mutateCards}
                />
              ))}
              {provided.placeholder}
            </Box>
          )}
        </Droppable>
      </DragDropContext>
      {card != null && <CardDetailsModal isOpen={isOpen} onClose={unSetCardQuery} card={card} />}
    </Box>
  )
}

export default ProjectColumns
