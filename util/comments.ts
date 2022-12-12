
import { connectToDatabase, toObjectId } from './mongodb'
import { ObjectId } from 'mongodb'
import sanitize from 'mongo-sanitize'

export const TABLE_NAME = 'comments'

export const getComments = async (where: any): Promise<any[]> => {
  const { db } = await connectToDatabase()
  where = sanitize(where)
  if (where._id != null) where._id = toObjectId(where._id)
  if (where.projectId != null) where.projectId = toObjectId(where.projectId)
  return await db.collection(TABLE_NAME).find(where).toArray()
}

export const getComment = async (where: string | ObjectId | any): Promise<any> => {
  if (where instanceof ObjectId || typeof where === 'string') {
    where = { _id: toObjectId(where) }
  } else {
    where = sanitize(where)
    if (where._id != null) where._id = toObjectId(where._id)
    if (where.projectId != null) where.projectId = toObjectId(where.projectId)
  }
  const { db } = await connectToDatabase()
  return await db.collection(TABLE_NAME).findOne(where)
}

export const createComment = async (data: any): Promise<boolean> => {
  const { db } = await connectToDatabase()
  data = sanitize(data)
  data.projectId = toObjectId(data.projectId)
  const result = await db.collection(TABLE_NAME).insertOne(data)
  return result.result.ok === 1
}

export const updateComment = async (_id: ObjectId | string, data: any): Promise<boolean> => {
  const { db } = await connectToDatabase()
  _id = toObjectId(_id)
  data = sanitize(data)
  const res = await db
    .collection(TABLE_NAME)
    .updateOne({ _id }, { $set: data })
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

