import React, { FC } from 'react'
import { CardDetail } from '@/src/types/cards'
import Card from '@/src/components/project/columns/card'

interface Props {
  cards: CardDetail[]
  showCardDetail: (cardId: string) => void
}

const Cards: FC<Props> = ({ cards, showCardDetail }) => {
  return (
    <>
      {cards?.map((card, index) => (
        <Card key={index} card={card} cardIndex={index} showCardDetail={showCardDetail} />
      ))}
    </>
  )
}

export default Cards
