import sanitize from 'mongo-sanitize'
import { connectToDatabase, toObjectId } from './mongodb'
import { ObjectId } from 'mongodb'
import { pick } from 'lodash'

export const TABLE_NAME = 'cards'

export interface Card {
  _id: string
  title: string
  desc: string
  state: CardState
  assignedTo?: ObjectId[]
  roles?: ObjectId[]
  projectId?: ObjectId
  sequence?: number
  label?: Label
}

export interface Label {
  bg: string
  type: string
}

export enum CardState {
  TODO = 'todo',
  BUSY = 'busy',
  DONE = 'done'
}

const stateValues = Object.values(CardState)

const UPDATABLE_FIELDS = ['title', 'desc', 'sequence', 'state']

export const createCard = async () => {

}

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
  { projectId, state, category }: { projectId: string | ObjectId, state?: CardState, category?: string }
): Promise<Card[]> => {
  const { db } = await connectToDatabase()
  const where: any = {
    projectId: toObjectId(projectId)
  }
  if (state != null) where.state = sanitize(state)
  if (category != null) where.category = sanitize(category)
  const cards = await db
    .collection(TABLE_NAME)
    .find(where)
  return cards
}

export const updateCard = async (_id: string | ObjectId, data: any): Promise<boolean> => {
  const { db } = await connectToDatabase()
  _id = toObjectId(_id)
  const updatableFields = pick(data, UPDATABLE_FIELDS)
  UPDATABLE_FIELDS.forEach(field => {
    if (updatableFields[field] != null) updatableFields[field] = sanitize(updatableFields[field])
  })
  if (updatableFields.state != null && !stateValues.includes(updatableFields.state)) throw new Error('Invalid state')
  const res = await db
    .collection(TABLE_NAME)
    .updateOne({ _id }, { $set: { ...updatableFields } })
  return res.result.ok === 1
}
