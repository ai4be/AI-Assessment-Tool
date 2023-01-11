import { toObjectId } from './mongodb'
import { ObjectId } from 'mongodb'
import { Card, Question } from '@/src/types/card'

export const dataToCards = async (data: any[], projectId?: string | ObjectId, columnId?: string | ObjectId): Promise<Card[]> => {
  const cards: Card[] = []
  let catIdx = 1
  for (const cat of data) {
    let idx = 0
    for (const card of cat.cards) {
      const returnCard: any = {
        ...card,
        category: cat.id,
        originalId: card.id,
        _id: ObjectId(),
        ...(projectId != null ? { projectId: toObjectId(projectId) } : {}),
        ...(columnId != null ? { columnId: toObjectId(columnId) } : {}),
        sequence: idx,
        number: +`${catIdx}.${idx + 1}`,
        title: `${catIdx}.${idx + 1} ${String(card.title)}`
      }
      card.questions = card.questions.map((q: any, i: number): Question => ({
        ...q,
        title: `${catIdx}.${idx + 1}.${i + 1} ${String(q.title)}`,
        ...(q.answers != null ? { answers: q.answers.map(a => typeof a === 'string' ? a.trim() : a) } : {})
      }))
      cards.push(returnCard)
      idx++
    }
    catIdx++
  }
  return cards
}
