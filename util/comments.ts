
import { connectToDatabase, toObjectId } from './mongodb'
import { ObjectId } from 'mongodb'
import sanitize from 'mongo-sanitize'
import pick from 'lodash.pick'

export const TABLE_NAME = 'comments'

export const getComments = async (where: any): Promise<any[]> => {
  const { db } = await connectToDatabase()
  where = sanitize(where)
  if (where._id != null) where._id = toObjectId(where._id)
  if (where.projectId != null) where.projectId = toObjectId(where.projectId)
  if (where.cardId != null) where.cardId = toObjectId(where.cardId)
  return await db.collection(TABLE_NAME).find(where).toArray()
}

export const getComment = async (where: string | ObjectId | any): Promise<any> => {
  if (where instanceof ObjectId || typeof where === 'string') {
    where = { _id: toObjectId(where) }
  } else {
    where = sanitize(where)
    if (where._id != null) where._id = toObjectId(where._id)
    if (where.cardId != null) where.cardId = toObjectId(where.cardId)
    if (where.projectId != null) where.projectId = toObjectId(where.projectId)
  }
  const { db } = await connectToDatabase()
  return await db.collection(TABLE_NAME).findOne(where)
}

export const createComment = async (data: any): Promise<any> => {
  const { db } = await connectToDatabase()
  data = sanitize(data)
  data.projectId = toObjectId(data.projectId)
  data.userId = toObjectId(data.userId)
  data.cardId = toObjectId(data.cardId)
  data.createdAt = new Date()
  let localData = pick(data, ['projectId', 'userId', 'text', 'cardId', 'createdAt', 'questionId'])
  localData = sanitize(localData)
  const result = await db.collection(TABLE_NAME).insertOne(localData)
  if (result.result.ok === 1) {
    const comment = await db.collection(TABLE_NAME).findOne({ _id: result.insertedId })
    return comment
  }
  return null
}

export const updateComment = async (_id: ObjectId | string, data: any): Promise<boolean> => {
  const { db } = await connectToDatabase()
  _id = toObjectId(_id)
  let localData: any = pick(data, ['text'])
  localData = sanitize(localData)
  localData.updatedAt = new Date()
  const res = await db
    .collection(TABLE_NAME)
    .updateOne({ _id }, { $set: localData })
  return res.result.ok === 1
}

export const deleteComment = async (_id: ObjectId | string): Promise<boolean> => {
  const { db } = await connectToDatabase()
  _id = toObjectId(_id)
  const res = await db
    .collection(TABLE_NAME)
    .deleteOne({ _id })
  return res.result.ok === 1
}

export const deleteComments = async (where: any): Promise<boolean> => {
  const { db } = await connectToDatabase()
  where = sanitize(where)
  if (where._id != null) where._id = toObjectId(where._id)
  if (where.projectId != null) where.projectId = toObjectId(where.projectId)
  const res = await db
    .collection(TABLE_NAME)
    .deleteMany(where)
  return res.result.ok === 1
}
