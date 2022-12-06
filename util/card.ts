import sanitize from 'mongo-sanitize'
import { connectToDatabase, toObjectId } from './mongodb'
import { ObjectId } from 'mongodb'
import { pick } from 'lodash'
import { getColumnsByProjectId } from './columns'

export const TABLE_NAME = 'cards'

export interface Card {
  _id: string
  title: string
  desc: string
  userIds?: ObjectId[]
  roleIds?: ObjectId[]
  projectId?: ObjectId
  sequence?: number
  label?: Label
}

export interface Label {
  bg: string
  type: string
}

const UPDATABLE_FIELDS = ['title', 'desc', 'sequence', 'columnId', 'label']

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
  const updatableFields = pick(data, UPDATABLE_FIELDS)
  UPDATABLE_FIELDS.forEach(field => {
    if (updatableFields[field] != null) updatableFields[field] = sanitize(updatableFields[field])
  })
  const card = await getCard(_id)
  const columns = await getColumnsByProjectId(card.projectId)
  if (updatableFields.columnId != null && columns.find(c => c._id === updatableFields.columnId) == null) throw new Error('Invalid columnId')
  if (updatableFields.columnId != null) updatableFields.columnId = toObjectId(updatableFields.columnId)
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
