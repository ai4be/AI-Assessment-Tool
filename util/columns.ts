
import { connectToDatabase, toObjectId } from './mongodb'
import { ObjectId } from 'mongodb'
import sanitize from 'mongo-sanitize'
import pick from 'lodash.pick'

export const TABLE_NAME = 'columns'

export enum ColumnName {
  TODO = 'to do',
  BUSY = 'busy',
  DONE = 'done'
}

export const defaultColumns = Object.values(ColumnName)

export const getColumns = async (where: any): Promise<any[]> => {
  const { db } = await connectToDatabase()
  where = sanitize(where)
  if (where._id != null) where._id = toObjectId(where._id)
  if (where.projectId != null) where.projectId = toObjectId(where.projectId)
  return await db.collection(TABLE_NAME).find(where).toArray()
}

export const getColumn = async (where: string | ObjectId | any): Promise<any> => {
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

export const createColumn = async (data: any): Promise<boolean> => {
  const { db } = await connectToDatabase()
  data = sanitize(data)
  data.projectId = toObjectId(data.projectId)
  const result = await db.collection(TABLE_NAME).insertOne(data)
  return result.result.ok === 1
}

export const createColumns = async (data: any[]): Promise<boolean> => {
  const { db } = await connectToDatabase()
  const createdAt = Date.now()
  data = sanitize(data)
  data = data.map(d => {
    if (d.projectId != null) d.projectId = toObjectId(d.projectId)
    if (d.createdBy != null) d.createdBy = toObjectId(d.createdBy)
    if (d.createdAt == null) d.createdAt = createdAt
    return d
  })
  const result = await db.collection(TABLE_NAME).insertMany(data)
  return result.result.ok === 1
}

export const createProjectDefaultColumns = async (projectId: ObjectId | string, createdBy: ObjectId | string): Promise<boolean> => {
  const projectColsData = defaultColumns.map((cn, idx) => ({
    projectId,
    name: cn,
    createdBy,
    idx
  }))
  return await createColumns(projectColsData)
}

export const updateColumn = async (_id: ObjectId | string, data: any): Promise<boolean> => {
  const { db } = await connectToDatabase()
  _id = toObjectId(_id)
  data = pick(sanitize(data), ['name', 'sequence'])
  data = sanitize(data)
  const res = await db
    .collection(TABLE_NAME)
    .updateOne({ _id }, { $set: data })
  return res.result.ok === 1
}

export const deleteColumn = async (_id: ObjectId | string): Promise<boolean> => {
  const { db } = await connectToDatabase()
  _id = toObjectId(_id)
  const res = await db
    .collection(TABLE_NAME)
    .deleteOne({ _id })
  return res.result.ok === 1
}

export const deleteColumns = async (where: any): Promise<boolean> => {
  const { db } = await connectToDatabase()
  where = sanitize(where)
  if (where._id != null) where._id = toObjectId(where._id)
  if (where.projectId != null) where.projectId = toObjectId(where.projectId)
  const res = await db
    .collection(TABLE_NAME)
    .deleteMany(where)
  return res.result.ok === 1
}

export const getColumnsByProjectId = async (projectId: ObjectId | string): Promise<any[]> => {
  return await getColumns({ projectId })
}

export const getTodoColumn = async (projectId: ObjectId | string): Promise<any> => {
  return await getColumn({ projectId, name: ColumnName.TODO })
}
