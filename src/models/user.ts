import { cleanEmail, cleanText, connectToDatabase, toObjectId } from '@/src/models/mongodb'
import { ObjectId } from 'mongodb'
import { isEmpty } from '@/util/index'
import { hashPassword, verifyPassword } from '@/util/auth'
import { isEmailValid, isPasswordValid } from '@/util/validator'
import { User, UserCreate } from '@/src/types/user'
import Model from '@/src/models/model'

const TABLE_NAME = 'users'

export default class UserModel extends Model {
  static TABLE_NAME = TABLE_NAME
}

export const getUser = async ({ _id, email }: { _id?: string | ObjectId, email?: string }, omitFields: string[] = ['password']): Promise<User | null> => {
  const { db } = await connectToDatabase()
  _id = _id != null ? toObjectId(_id) : undefined
  email = typeof email === 'string' ? cleanEmail(email) : undefined
  const where: any = {}
  if (_id != null) where._id = _id
  if (email != null) where.email = email
  if (isEmpty(where)) return null
  const projection: any = {}
  omitFields.forEach(field => (projection[field] = 0))
  if (isEmpty(projection)) return await db.collection(TABLE_NAME).findOne(where)
  return await db.collection(TABLE_NAME).findOne(where, { projection })
}

export const getUsers = async (userIds?: Array<string | ObjectId>, omitFields: string[] = ['password', 'avatar']): Promise<User[]> => {
  const { db } = await connectToDatabase()
  let where = {}
  if (Array.isArray(userIds)) {
    userIds = userIds.map(id => toObjectId(id))
    where = { _id: { $in: userIds } }
  }
  const projection: any = {}
  omitFields.forEach(field => (projection[field] = 0))
  return await db.collection(TABLE_NAME).find(where, { projection }).toArray()
}

export const createUser = async ({ email, password, firstName, lastName }: UserCreate): Promise<User> => {
  const { db } = await connectToDatabase()
  email = cleanEmail(email)
  firstName = cleanText(firstName)
  lastName = cleanText(lastName)
  const createdAt = new Date()
  const res = await db.collection(TABLE_NAME).insertOne({ email, password, firstName, lastName, createdAt, emailVerified: false })
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

export const updateUser = async (_id: string | ObjectId, updateData: Partial<User>): Promise<boolean> => {
  const { db } = await connectToDatabase()
  _id = toObjectId(_id)
  const objectKeys = Object.keys(updateData)
  const updateableTxtFields = ['email', 'firstName', 'lastName', 'avatar', 'xsAvatar', 'organization', 'department', 'role']
  const update: Partial<User> = {}
  for (const field of updateableTxtFields) {
    if (updateData[field] != null) update[field] = cleanText(updateData[field])
  }
  if (update.email != null) update.email = cleanEmail(update.email)
  if (update.email != null && !isEmailValid(update.email)) throw new Error('Invalid email')
  if (objectKeys.includes('emailVerified')) update.emailVerified = updateData.emailVerified === true
  if (isEmpty(update)) return false

  const res = await db.collection(TABLE_NAME).updateOne({ _id }, { $set: update })
  return res.modifiedCount === 1
}

export const updateToDeletedUser = async (_id: string | ObjectId): Promise<boolean> => {
  const deletedUserData: Partial<User> = {
    email: 'deleted@user.com',
    firstName: 'deleted',
    lastName: 'user',
    avatar: '',
    xsAvatar: '',
    isDeleted: true,
    deletedAt: new Date()
  }

  const { db } = await connectToDatabase()
  _id = toObjectId(_id)

  const res = await db.collection(TABLE_NAME).updateOne({ _id }, { $set: deletedUserData })
  return res.modifiedCount === 1
}
