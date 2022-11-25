import { connectToDatabase, toObjectId } from '@/util/mongodb'
import sanitize from 'mongo-sanitize'
import { ObjectId } from 'mongodb'
import isEmpty from 'lodash.isempty'

const TABLE_NAME = 'users'

export interface User {
  _id?: ObjectId
  email: string
  password: string
  fullName: string
  avatar?: string
}

export const getUser = async ({ _id, email }: { _id?: string | ObjectId, email?: string }): Promise<User | null> => {
  const { db } = await connectToDatabase()
  _id = _id != null ? toObjectId(_id) : undefined
  email = typeof email === 'string' ? sanitize(email.trim().toLowerCase()) : undefined
  const where: any = {}
  if (_id != null) where._id = _id
  if (email != null) where.email = email
  if (isEmpty(where)) return null
  console.log(where)
  return await db.collection(TABLE_NAME).findOne(where)
}

export const getUsers = async (userIds: Array<string | ObjectId>, omitFields: string[] = ['password']): Promise<User[]> => {
  const { db } = await connectToDatabase()
  userIds = userIds.map(id => toObjectId(id))
  const projection: any = {}
  omitFields.forEach(field => (projection[field] = 0))
  return await db.collection(TABLE_NAME).find({ _id: { $in: userIds } }, { projection }).toArray()
}
