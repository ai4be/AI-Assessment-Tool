import { toObjectId } from './mongodb'
import { ObjectId } from 'mongodb'

export const dataToCards = async (data: any[], projectId?: string | ObjectId, columnId?: string | ObjectId): Promise<any[]> => {
  const cards: any[] = []
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
        title: `${catIdx}.${idx + 1} ${String(card.title)}`
      }
      card.questions = card.questions.map((q: any, i: number) => ({
        ...q,
        title: `${catIdx}.${idx + 1}.${i + 1} ${String(q.title)}`,
        answers: q.answers.map(a => typeof a === 'string' ? a.trim() : a)
      }))
      cards.push(returnCard)
      idx++
    }
    catIdx++
    // console.log(cat.title, idx)
  }
  return cards
}
