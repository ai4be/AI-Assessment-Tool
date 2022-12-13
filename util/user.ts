import { cleanEmail, cleanText, connectToDatabase, toObjectId } from '@/util/mongodb'
import sanitize from 'mongo-sanitize'
import { ObjectId } from 'mongodb'
import isEmpty from 'lodash.isempty'
import { hashPassword, verifyPassword } from './auth'
import { isEmailValid, isPasswordValid } from './validator'

const TABLE_NAME = 'users'

export interface User {
  _id?: ObjectId
  email: string
  password?: string
  firstName: string
  lastName: string
  emailVerified?: Boolean
  avatar?: string
  xsAvatar?: string
}

export const getUser = async ({ _id, email }: { _id?: string | ObjectId, email?: string }, omitFields: string[] = ['password']): Promise<User | null> => {
  const { db } = await connectToDatabase()
  _id = _id != null ? toObjectId(_id) : undefined
  email = typeof email === 'string' ? sanitize(email.trim().toLowerCase()) : undefined
  const where: any = {}
  if (_id != null) where._id = _id
  if (email != null) where.email = email
  if (isEmpty(where)) return null
  const projection: any = {}
  omitFields.forEach(field => (projection[field] = 0))
  if (isEmpty(projection)) return await db.collection(TABLE_NAME).findOne(where)
  return await db.collection(TABLE_NAME).findOne(where, { projection })
}

export const getUsers = async (userIds: Array<string | ObjectId>, omitFields: string[] = ['password', 'avatar']): Promise<User[]> => {
  const { db } = await connectToDatabase()
  userIds = userIds.map(id => toObjectId(id))
  const projection: any = {}
  omitFields.forEach(field => (projection[field] = 0))
  return await db.collection(TABLE_NAME).find({ _id: { $in: userIds } }, { projection }).toArray()
}

export const createUser = async ({ email, password, firstName, lastName }: { email: string, password: string, firstName: string, lastName: string }): Promise<User> => {
  const { db } = await connectToDatabase()
  email = cleanEmail(email)
  firstName = cleanText(firstName)
  lastName = cleanText(lastName)
  const res = await db.collection(TABLE_NAME).insertOne({ email, password, firstName, lastName })
  return { email, password, firstName, lastName, _id: res.insertedId }
}

export const updatePassword = async ({ _id, password, currentPassword }: { _id: string | ObjectId, password: string, currentPassword?: string | undefined }): Promise<boolean> => {
  const { db } = await connectToDatabase()
  _id = toObjectId(_id)
  if (password == null) return false
  if (currentPassword != null) {
    const user = await getUser({ _id }, [])
    if (user == null) throw new Error('not found')
    const isValid = await verifyPassword(
      currentPassword,
      String(user?.password)
    )
    if (!isValid) throw new Error('Wrong credentials')
  }
  if (!isPasswordValid(password)) throw new Error('Invalid password, password should be at least 8 characters long, contain a number and a special character')
  const hashedPassword = await hashPassword(password)
  const res = await db.collection(TABLE_NAME).updateOne({ _id }, { $set: { password: hashedPassword } })
  return res.modifiedCount === 1
}

export const resetPassword = async (_id: string | ObjectId, password: string): Promise<boolean> => {
  const { db } = await connectToDatabase()
  _id = toObjectId(_id)
  const res = await db.collection(TABLE_NAME).updateOne({ _id }, { $set: { password } })
  return res.modifiedCount === 1
}

export const updateUser = async (_id: string | ObjectId, updateData: any): Promise<boolean> => {
  const { db } = await connectToDatabase()
  _id = toObjectId(_id)
  const { email, firstName, lastName, avatar, xsAvatar } = updateData
  const update: any = {}
  if (email != null) update.email = cleanEmail(email)
  if (firstName != null) update.firstName = cleanText(firstName)
  if (lastName != null) update.lastName = cleanText(lastName)
  if (avatar != null) update.avatar = cleanText(avatar)
  if (xsAvatar != null) update.xsAvatar = cleanText(xsAvatar)
  if (isEmpty(update)) return false

  if (update.email != null && !isEmailValid(update.email)) throw new Error('Invalid email')

  const res = await db.collection(TABLE_NAME).updateOne({ _id }, { $set: update })
  return res.modifiedCount === 1
}
