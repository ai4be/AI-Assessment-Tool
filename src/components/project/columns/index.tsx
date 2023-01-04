import React, { useState, FC, useEffect } from 'react'
import { Box, useDisclosure } from '@chakra-ui/react'
import CardDetailsModal from '@/src/components/project/columns/modals/card-details-modal'
import Column from '@/src/components/project/columns/column'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import useSWR from 'swr'
import { updateCard } from '@/util/cards'
import { fetcher } from '@/util/api'
import { useRouter } from 'next/router'
import ProjectBar from '@/src/components/project/project-bar'
import { stageValues, CardStage } from '@/src/types/cards'
import { isEmpty } from '@/util/index'
import { Assignment, DueDate, QueryFilterKeys } from '../project-bar/filter-menu'

interface IProps {
  project: any
  session: any
}

const ProjectColumns: FC<IProps> = ({ project, session }: { project: any, session: any }): JSX.Element => {
  const router = useRouter()
  const projectId = String(project?._id)
  const {
    card: cardId,
    cat: categoryId,
    stage,
    [QueryFilterKeys.ASSIGNED_TO]: assignedTo,
    [QueryFilterKeys.DUE_DATE]: dueDate,
    [QueryFilterKeys.ASSIGNMENT]: assignment
  } = router.query
  const { data, error, mutate } = useSWR(`/api/projects/${projectId}/columns`, fetcher)
  const { data: dataCards, error: errorCards, mutate: mutateCards } = useSWR(`/api/projects/${projectId}/cards`, fetcher)

  const { isOpen, onOpen, onClose } = useDisclosure()
  const [cardDetail, setCardDetail] = useState<any>({ _id: '', title: '', description: '' })

  const [columns, setColumns] = useState<any[]>([])
  const [cards, setCards] = useState<any[]>([])
  // useRenderingTrace('ProjectColumns', { projectId, session, columns, cards, isLoading, cardDetail }, 'log')

  useEffect(() => {
    if (Array.isArray(data)) {
      setColumnsSorted(data)
    } else {
      setColumns([])
    }
  }, [data])

  useEffect(() => {
    setCards(dataCards ?? [])
  }, [dataCards])

  useEffect(() => {
    if (cardId != null && Array.isArray(cards)) {
      const card = cards.find((card) => card._id === cardId)
      if (card != null) showCardDetail(card._id)
      else {
        const query: any = { ...router.query }
        delete query.card
        void router.push({ query }, undefined, { shallow: true })
      }
    }
  }, [cardId, cards])

  // useEffect(() => {
  //   if (categoryId != null && Array.isArray(cards)) {
  //     const catCards = cards.filter(card => card.categoryId === categoryId)
  //     catCards.sort((a, b) => a.order - b.order)
  //   }
  // }, [categoryId, cards])

  const setColumnsSorted = (cols: any[]): void => {
    cols.sort((a, b) => a.sequence - b.sequence)
    setColumns(cols)
  }

  const showCardDetail = (cardId: string): void => {
    const card = cards.find(card => card._id === cardId)
    void router.push({
      pathname: router.route,
      query: { ...router.query, card: cardId }
    }, undefined, { shallow: true })
    setCardDetail(card)
    onOpen()
  }

  const hideCardDetail = async (): Promise<void> => {
    onClose()
    const query = { ...router.query }
    delete query.card
    await router.push({
      pathname: router.route,
      query
    }, undefined, { shallow: true })
  }

  const filterCardsArrayFn = (card: any, columnId: string): boolean => {
    let val = String(card.columnId) === columnId
    if (val && categoryId != null) val = card.category === categoryId
    if (val && stage != null && String(stage).toUpperCase() !== 'ALL') {
      val = card.stage === stage || (stage === CardStage.PREPARATION && (card.stage == null || card.stage.trim() === ''))
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
    const promises: Array<Promise<any>> = [updateCard(patchCard, project?._id)]
    for (let i = destinationIndex; i < sortedCards.length; i++) {
      const card = sortedCards[i]
      sequence += 1
      card.sequence = sequence

      const patchCard = {
        _id: card._id,
        sequence,
        columnId: destinationColumnId
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
                <Column
                  key={column._id}
                  column={column}
                  id={column._id}
                  index={index}
                  cards={filterCards(column._id)}
                  showCardDetail={showCardDetail}
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
      <CardDetailsModal isOpen={isOpen} onClose={hideCardDetail} card={cardDetail} projectId={project?._id} fetchCards={mutateCards} />
    </Box>
  )
}

export default ProjectColumns
