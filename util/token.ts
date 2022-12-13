import { connectToDatabase, toObjectId, cleanEmail } from '@/util/mongodb'
import sanitize from 'mongo-sanitize'
import { ObjectId } from 'mongodb'
import uniqid from 'uniqid'
import { getUser } from './user'
import isEmpty from 'lodash.isempty'
import { addUser, getUserProjects } from './project'

const TABLE_NAME = 'tokens'
export const RESET_PASSWORD_TOKEN_EXPIRATION = +(process.env.RESET_PASSWORD_TOKEN_EXPIRATION ?? 3600 * 2 * 1000) // 2 hours

export enum TokenStatus {
  PENDING = 'PENDING',
  REDEEMED = 'REDEEMED',
  EXPIRED = 'EXPIRED'
}

export enum TokenType {
  INVITE = 'INVITE',
  RESET_PASSWORD = 'RESET_PASSWORD'
}

export interface Token {
  _id?: ObjectId
  token: string
  userId?: ObjectId
  status: TokenStatus
  type: TokenType
  email: string
  projectId: ObjectId
  createdBy?: ObjectId
  createdAt: number
}

export const getToken = async ({ _id, token, type, createdBy }: { _id?: string | ObjectId, token?: string, type?: TokenType, createdBy?: string | ObjectId }): Promise<Token | null> => {
  const { db } = await connectToDatabase()
  _id = _id instanceof ObjectId ? _id : toObjectId(_id)
  createdBy = createdBy instanceof ObjectId ? createdBy : toObjectId(createdBy)
  token = typeof token === 'string' ? sanitize(token) : undefined
  type = type != null ? sanitize(type) : undefined
  const where: any = {}
  if (_id != null) where._id = _id
  if (token != null) where.token = token
  if (token != null) where.token = token
  if (type != null) where.type = type
  if (createdBy != null) where.createdBy = createdBy
  console.log(where)
  if (isEmpty(where)) return null
  if (isEmpty(where.token) && isEmpty(where._id)) return await db.collection(TABLE_NAME).find(where).sort({ createdAt: -1 }).limit(1).next()
  return await db.collection(TABLE_NAME).findOne(where)
}

export const invitedUserHandler = async (token: string, email: string): Promise<void> => {
  token = sanitize(token)
  email = cleanEmail(email)
  const { db } = await connectToDatabase()
  const dbToken = await db.collection(TABLE_NAME).findOne({ token })
  if (dbToken != null) {
    const { projectId, status } = dbToken
    if (status === TokenStatus.PENDING && projectId != null) {
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
  await db.collection(TABLE_NAME)
    .insertOne({ token, userId: user?._id, createdBy, status: TokenStatus.PENDING, type: TokenType.INVITE, email, projectId, createdAt: Date.now() })
  return await db.collection(TABLE_NAME).findOne({ token })
}

export const isTokenExpired = (token: Token): boolean => {
  if (token.createdAt == null) return true
  if (token.type === TokenType.RESET_PASSWORD) {
    return +token.createdAt + RESET_PASSWORD_TOKEN_EXPIRATION < Date.now()
  }
  return false
}

export const createResetPasswordToken = async (createdBy: string | ObjectId): Promise<Token> => {
  const token = uniqid()
  const { db } = await connectToDatabase()
  const user = await getUser({ _id: createdBy })
  if (user == null) throw new Error('User not found')
  // expire all other reset password tokens
  await db.collection(TABLE_NAME).updateMany({ userId: user._id, type: TokenType.RESET_PASSWORD }, { $set: { status: TokenStatus.EXPIRED } })
  await db.collection(TABLE_NAME)
    .insertOne({ token, userId: user._id, createdBy: user._id, status: TokenStatus.PENDING, type: TokenType.RESET_PASSWORD, email: user.email, createdAt: Date.now() })
  return await db.collection(TABLE_NAME).findOne({ token })
}

export const getProjectInvites = async (projectId: string | ObjectId): Promise<Token[]> => {
  const { db } = await connectToDatabase()
  projectId = toObjectId(projectId)
  return await db.collection(TABLE_NAME).find({
    projectId,
    status: TokenStatus.PENDING,
    type: {
      $or: [TokenType.INVITE, { $exists: false }]
    }
  }).toArray()
}
