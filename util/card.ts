import sanitize from 'mongo-sanitize'
import { connectToDatabase, toObjectId } from './mongodb'
import { ObjectId } from 'mongodb'
import { getColumnsByProjectId } from './columns'
import { CardStage, Card, stageValues } from '../src/types/cards'

export const TABLE_NAME = 'cards'

const UPDATABLE_FIELDS = ['title', 'desc', 'sequence', 'columnId', 'label', 'dueDate', 'stage']

export const getCard = async (_id: string | ObjectId): Promise<Card> => {
  const { db } = await connectToDatabase()
  const where: any = {
    _id: toObjectId(_id)
  }
  const card = await db
    .collection(TABLE_NAME)
    .findOne(where)
  return card
}

export const deleteCards = async (projectId: string | ObjectId): Promise<boolean> => {
  const { db } = await connectToDatabase()
  const where: any = {
    projectId: toObjectId(projectId)
  }
  const res = await db
    .collection(TABLE_NAME)
    .deleteMany(where)
  return res.result.ok === 1
}

export const getCards = async (
  { projectId, columnId, category }: { projectId: string | ObjectId, columnId?: string, category?: string }
): Promise<Card[]> => {
  const { db } = await connectToDatabase()
  const where: any = {
    projectId: toObjectId(projectId)
  }
  if (columnId != null) where.columnId = toObjectId(columnId)
  if (category != null) where.category = sanitize(category)
  const cards = await db
    .collection(TABLE_NAME)
    .find(where).toArray()
  return cards
}

export const createCards = async (cards: Card[]): Promise<boolean> => {
  const { db } = await connectToDatabase()
  cards = sanitize(cards)
  cards.map(c => ({
    ...c,
    ...(c._id != null ? { _id: toObjectId(c._id) } : {}),
    ...(c.projectId != null ? { projectId: toObjectId(c.projectId) } : {}),
    ...(c?.userIds != null && c?.userIds?.length > 0 ? { userIds: c?.userIds?.map(toObjectId) } : {}),
    ...(c?.roleIds != null && c?.roleIds?.length > 0 ? { roleIds: c?.roleIds?.map(toObjectId) } : {})
  }))
  const res = await db
    .collection(TABLE_NAME)
    .insertMany(cards)
  return res.result.ok === 1
}

export const updateCard = async (_id: string | ObjectId, data: any): Promise<boolean> => {
  const { db } = await connectToDatabase()
  _id = toObjectId(_id)
  const updatableFields: any = {}
  UPDATABLE_FIELDS.forEach(field => {
    if (data[field] != null) updatableFields[field] = sanitize(data[field])
  })
  const card = await getCard(_id)
  const columns = await getColumnsByProjectId(card.projectId)
  if (updatableFields.columnId != null && columns.find(c => String(c._id) === String(updatableFields.columnId)) == null) throw new Error('Invalid columnId')
  if (updatableFields.columnId != null) updatableFields.columnId = toObjectId(updatableFields.columnId)
  if (typeof updatableFields.stage === 'string' && !stageValues.includes(updatableFields.stage.toUpperCase())) throw new Error('Invalid stage')
  if (updatableFields.stage != null) updatableFields.stage = updatableFields.stage.toUpperCase()
  const res = await db
    .collection(TABLE_NAME)
    .updateOne({ _id }, { $set: { ...updatableFields } })
  return res.result.ok === 1
}

export const addUserToCard = async (cardId: ObjectId | string, userId: ObjectId | string): Promise<boolean> => {
  const { db } = await connectToDatabase()
  const res = await db.collection(TABLE_NAME).updateOne(
    { _id: toObjectId(cardId) },
    {
      $addToSet: {
        userIds: toObjectId(userId)
      }
    }
  )
  return res.result.ok === 1
}

export const removeUserFromCard = async (cardId: ObjectId | string, userId: ObjectId | string): Promise<boolean> => {
  const { db } = await connectToDatabase()
  const res = await db.collection(TABLE_NAME).updateOne(
    { _id: toObjectId(cardId) },
    {
      $pull: {
        userIds: toObjectId(userId)
      }
    }
  )
  return res.result.ok === 1
}

export const updateQuestion = async (cardId: ObjectId | string, questionId: string, data: any): Promise<boolean> => {
  const { db } = await connectToDatabase()
  let { responses, conclusion } = data
  responses = sanitize(responses)
  conclusion = sanitize(conclusion)
  const set = {}
  if (responses != null) set['questions.$.responses'] = responses
  if (conclusion != null) set['questions.$.conclusion'] = conclusion
  const res = await db.collection(TABLE_NAME).updateOne(
    { _id: toObjectId(cardId), 'questions.id': questionId },
    {
      $set: set
    }
  )
  return res.result.ok === 1
}
