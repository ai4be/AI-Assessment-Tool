
import { cleanText, connectToDatabase, toObjectId } from './mongodb'
import { ObjectId } from 'mongodb'
import { getUsers, User } from './user'
import sanitize from 'mongo-sanitize'
import { createProjectDefaultColumns, getTodoColumn } from './columns'
import { createCards } from './card'

export const TABLE_NAME = 'projects'

export interface Project {
  _id?: ObjectId
  name: string
  createdBy?: ObjectId
  createdAt: number
  backgroundImage?: string
  users?: ObjectId[]
  roles?: Role[]
}

export const createProject = async ({ name, createdBy }: { name: string, createdBy: ObjectId | string }, addDefaultColumns = true): Promise<string> => {
  const { db } = await connectToDatabase()
  name = cleanText(name)
  createdBy = toObjectId(createdBy)
  const createdAt = Date.now()
  const data = {
    _id: ObjectId(),
    name,
    createdAt,
    createdBy,
    users: []
  }
  const result = await db.collection(TABLE_NAME).insertOne(data)
  if (addDefaultColumns) await createProjectDefaultColumns(data._id, createdBy)
  return String(result.insertedId)
}

export const createProjectWithDefaultColumnsAndCards = async (name: string, createdBy: ObjectId | string, cards: any[]): Promise<string> => {
  const projectId = await createProject({ name, createdBy }, true)
  const todoColumn = await getTodoColumn(projectId)
  cards = sanitize(cards)
  cards = cards.map(c => ({
    ...c,
    projectId: toObjectId(projectId),
    columnId: toObjectId(todoColumn._id)
  }))
  await createCards(cards)
  return String(projectId)
}

export const getProject = async (_id: ObjectId | string): Promise<Project> => {
  const { db } = await connectToDatabase()
  _id = toObjectId(_id)
  return await db.collection(TABLE_NAME).findOne({ _id })
}

export const updateProject = async (_id: ObjectId | string, data: any): Promise<boolean> => {
  const { db } = await connectToDatabase()
  _id = toObjectId(_id)
  const name = sanitize(data.name)
  const backgroundImage = sanitize(data.backgroundImage)
  const res = await db
    .collection(TABLE_NAME)
    .updateOne({ _id }, { $set: { name, backgroundImage } })
  return res.result.ok === 1
}

export const deleteProject = async (_id: ObjectId | string): Promise<boolean> => {
  const { db } = await connectToDatabase()
  _id = toObjectId(_id)
  const res = await db
    .collection(TABLE_NAME)
    .deleteOne({ _id })
  return res.result.ok === 1
}

export const getUserProjects = async (userId: ObjectId | string, projectId?: string | ObjectId): Promise<Project[]> => {
  const { db } = await connectToDatabase()
  userId = toObjectId(userId)
  projectId = projectId != null ? toObjectId(projectId) : undefined
  const where: any = {
    $or: [
      { users: userId },
      { createdBy: userId }
    ]
  }
  if (projectId != null) where._id = projectId
  return await db.collection(TABLE_NAME).find(where).toArray()
}

export const addUser = async (_id: ObjectId | string, userId: ObjectId | string): Promise<boolean> => {
  const { db } = await connectToDatabase()
  _id = toObjectId(_id)
  userId = toObjectId(userId)
  const result = await db
    .collection(TABLE_NAME)
    .updateOne({ _id }, { $addToSet: { users: userId } })
  return result.result.ok === 1
}

export const removeUser = async (_id: ObjectId | string, userId: ObjectId | string): Promise<boolean> => {
  const { db } = await connectToDatabase()
  _id = toObjectId(_id)
  userId = toObjectId(userId)
  const result = await db
    .collection(TABLE_NAME)
    .updateOne({ _id }, { $pull: { users: userId } })
  return result.result.ok === 1
}

export const getProjectUsers = async (_id: ObjectId | string): Promise<User[]> => {
  const { db } = await connectToDatabase()
  _id = toObjectId(_id)
  const project = await db.collection(TABLE_NAME).findOne({ _id }, { projection: { users: 1, createdBy: 1 } })
  return await getUsers([...project.users, project.createdBy])
}

export const getProjectRoles = async (_id: ObjectId | string): Promise<Role[]> => {
  const { db } = await connectToDatabase()
  _id = toObjectId(_id)
  const project = await db.collection(TABLE_NAME).findOne({ _id }, { projection: { roles: 1 } })
  return project?.roles
}
