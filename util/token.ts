import { connectToDatabase, toObjectId, cleanEmail } from '@/util/mongodb'
import sanitize from 'mongo-sanitize'
import { ObjectId } from 'mongodb'
import uniqid from 'uniqid'
import { getUser } from './user'
import isEmpty from 'lodash.isempty'
import { addUser, getUserProjects } from './project'

export enum TokenStatus {
  PENDING = 'PENDING',
  REDEEMED = 'REDEEMED',
  EXPIRED = 'EXPIRED'
}

export interface Token {
  _id?: ObjectId
  token: string
  userId?: ObjectId
  status: TokenStatus
  email: string
  projectId: ObjectId
  createdBy?: ObjectId
  createdAt: number
}

const TABLE_NAME = 'tokens'

export const getToken = async ({ _id, token }: { _id?: string | ObjectId, token?: string }): Promise<Token | null> => {
  const { db } = await connectToDatabase()
  _id = _id instanceof ObjectId ? _id : toObjectId(_id)
  token = typeof token === 'string' ? sanitize(token) : undefined
  const where: any = {}
  if (_id != null) where._id = _id
  if (token != null) where.token = token
  console.log(where)
  if (isEmpty(where)) return null
  return await db.collection(TABLE_NAME).findOne(where)
}

export const invitedUserHandler = async (token: string, email: string): Promise<void> => {
  token = sanitize(token)
  email = cleanEmail(email)
  const { db } = await connectToDatabase()
  const dbToken = await db.collection(TABLE_NAME).findOne({ token })
  if (dbToken != null) {
    const { projectId, status } = dbToken
    if (status === TokenStatus.PENDING) {
      const user = await getUser({ email })
      await addUser(projectId, user?._id)
      await setStatus(token, TokenStatus.REDEEMED)
    }
  }
}

export const deleteToken = async (_id: string | ObjectId): Promise<boolean> => {
  const { db } = await connectToDatabase()
  _id = toObjectId(_id)
  const res = await db.collection(TABLE_NAME).deleteOne({ _id })
  return res.deletedCount === 1
}

export const setStatus = async (token: string, status: TokenStatus): Promise<boolean> => {
  const { db } = await connectToDatabase()
  const res = await db.collection(TABLE_NAME).updateOne({ token }, { $set: { status } })
  return res.result.ok === 1
}

export const inviteUser = async (projectId: string | ObjectId, email: string, createdBy: string | ObjectId): Promise<Token> => {
  const token = uniqid()
  const { db } = await connectToDatabase()
  projectId = toObjectId(projectId)
  createdBy = toObjectId(createdBy)
  const user = await getUser({ email })
  if (user != null) {
    const projects = await getUserProjects(user?._id, projectId)
    if (projects?.length > 0) throw new Error('User already invited')
  }
  console.log('user', user)
  await db.collection(TABLE_NAME)
    .insertOne({ token, userId: user?._id, createdBy, status: TokenStatus.PENDING, email, projectId, createdAt: Date.now() })
  return await db.collection(TABLE_NAME).findOne({ token })
}

export const getProjectInvites = async (projectId: string | ObjectId): Promise<Token[]> => {
  const { db } = await connectToDatabase()
  projectId = toObjectId(projectId)
  return await db.collection(TABLE_NAME).find({ projectId, status: TokenStatus.PENDING }).toArray()
}
