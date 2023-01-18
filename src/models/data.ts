import { toObjectId } from './mongodb'
import { ObjectId } from 'mongodb'
import { Card, Question } from '@/src/types/card'

export const dataToCards = async (data: any[], projectId?: string | ObjectId, columnId?: string | ObjectId): Promise<Card[]> => {
  const cards: Card[] = []
  let catIdx = 1
  for (const cat of data) {
    let idx = 0
    for (const card of cat.cards) {
      const returnCard: Card = {
        ...card,
        category: cat.id,
        originalId: card.id,
        _id: ObjectId(),
        ...(projectId != null ? { projectId: toObjectId(projectId) } : {}),
        ...(columnId != null ? { columnId: toObjectId(columnId) } : {}),
        sequence: idx,
        TOCnumber: `${catIdx}.${idx + 1}`,
        title: card.title
      }
      card.questions = card.questions.map((q: any, i: number): Question => ({
        ...q,
        TOCnumber: `${returnCard.TOCnumber}.${i + 1}`,
        title: q.title,
        ...(q.answers != null ? { answers: q.answers.map(a => typeof a === 'string' ? a.trim() : a) } : {})
      }))
      cards.push(returnCard)
      idx++
    }
    catIdx++
  }
  return cards
}
