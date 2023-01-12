
import { ObjectId } from 'mongodb'
import sanitize from 'mongo-sanitize'
import { cleanText, connectToDatabase, toObjectId } from '@/src/models/mongodb'
import { getUsers, User } from '@/src/models/user'
import { isEmpty } from '@/util/index'
import { deleteProjectCards, createCards } from '@/src/models/card'
import { deleteProjectColumns, createProjectDefaultColumns, getTodoColumn } from '@/src/models/column'
import Activity from '@/src/models/activity'
import { ActivityType } from '@/src/types/activity'
import { Project } from '@/src/types/project'

export const TABLE_NAME = 'projects'

export const createProject = async ({ name, createdBy, description, industry }: { name: string, createdBy: ObjectId | string, description?: string, industry?: string }, addDefaultColumns = true): Promise<string> => {
  const { db } = await connectToDatabase()
  name = cleanText(name)
  createdBy = toObjectId(createdBy)
  const createdAt = Date.now()
  const data: Partial<Project> = {
    _id: ObjectId(),
    name,
    createdAt,
    createdBy,
    userIds: []
  }
  if (description != null) data.description = cleanText(description)
  if (industry != null) data.industry = cleanText(industry)
  const result = await db.collection(TABLE_NAME).insertOne(data)
  if (addDefaultColumns) await createProjectDefaultColumns(data._id, createdBy)
  return result.insertedId
}

export const createProjectAndActivity = async (data: any, userId: ObjectId | string): Promise<string> => {
  const res = await createProject(data)
  if (res != null) void Activity.createProjectCreateActivity(res, userId, data)
  return res
}

export const createProjectWithDefaultColumnsAndCardsAndActivity = async (data: any, cards: any[], userId: string): Promise<string> => {
  const projectId = await createProjectAndActivity(data, userId)
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

export const updateProjectAndCreateActivity = async (_id: ObjectId | string, data: any, userId: ObjectId | string): Promise<boolean> => {
  const res = await updateProject(_id, data)
  if (res) void Activity.createProjectUpdateActivities(_id, userId, data)
  return res
}

export const updateProject = async (_id: ObjectId | string, data: any): Promise<boolean> => {
  const { db } = await connectToDatabase()
  _id = toObjectId(_id)
  const updateData: any = {}
  const updateableProps = ['name', 'description', 'industry', 'backgroundImage']
  for (const prop of updateableProps) {
    if (data[prop] != null) updateData[prop] = cleanText(data[prop])
  }
  if (isEmpty(updateableProps)) return false
  const res = await db
    .collection(TABLE_NAME)
    .updateOne({ _id }, { $set: updateData })
  return res.result.ok === 1
}

export const deleteProjectAndCreateActivity = async (_id: ObjectId | string, userId: ObjectId | string): Promise<boolean> => {
  const project = await getProject(_id)
  const res = await deleteProject(_id)
  if (res) void Activity.createActivity(_id, userId, ActivityType.PROJECT_DELETE, { name: project.name })
  return res
}

export const deleteProject = async (_id: ObjectId | string): Promise<boolean> => {
  _id = toObjectId(_id)
  await deleteProjectCards(_id)
  await deleteProjectColumns(_id)
  const { db } = await connectToDatabase()
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
      { userIds: userId },
      { createdBy: userId }
    ]
  }
  if (projectId != null) where._id = projectId
  return await db.collection(TABLE_NAME).find(where).toArray()
}

export const addUserAndCreateActivity = async (_id: ObjectId | string, userId: ObjectId | string, addedUserId: ObjectId | string): Promise<boolean> => {
  const res = await addUser(_id, addedUserId)
  if (res) void Activity.createActivity(_id, userId, ActivityType.PROJECT_USER_ADD, null, { userIds: [addedUserId] })
  return res
}

export const removeUserAndCreateActivity = async (_id: ObjectId | string, userId: ObjectId | string, removedUserId: ObjectId | string): Promise<boolean> => {
  const res = await removeUser(_id, removedUserId)
  if (res) void Activity.createActivity(_id, userId, ActivityType.PROJECT_USER_REMOVE, null, { userIds: [removedUserId] })
  return res
}

export const addUser = async (_id: ObjectId | string, userId: ObjectId | string): Promise<boolean> => {
  const { db } = await connectToDatabase()
  _id = toObjectId(_id)
  userId = toObjectId(userId)
  const result = await db
    .collection(TABLE_NAME)
    .updateOne({ _id }, { $addToSet: { userIds: userId } })
  return result.result.ok === 1
}

export const removeUser = async (_id: ObjectId | string, userId: ObjectId | string): Promise<boolean> => {
  const { db } = await connectToDatabase()
  _id = toObjectId(_id)
  userId = toObjectId(userId)
  const result = await db
    .collection(TABLE_NAME)
    .updateOne({ _id }, { $pull: { userIds: userId } })
  return result.result.ok === 1
}

export const getProjectUsers = async (_id: ObjectId | string, filterUserIds?: Array<string | ObjectId>): Promise<User[]> => {
  const { db } = await connectToDatabase()
  _id = toObjectId(_id)
  const project = await db.collection(TABLE_NAME).findOne({ _id }, { projection: { userIds: 1, createdBy: 1 } })
  let userIds: any = []
  if (project?.userIds != null) userIds.push(...project.userIds, project.createdBy)
  if (filterUserIds != null) {
    filterUserIds = filterUserIds.map(String)
    userIds = userIds.filter(id => filterUserIds?.includes(String(id)))
  }
  return await getUsers(userIds)
}

export const getProjectRoles = async (_id: ObjectId | string): Promise<any[]> => {
  const { db } = await connectToDatabase()
  _id = toObjectId(_id)
  const project = await db.collection(TABLE_NAME).findOne({ _id }, { projection: { roles: 1 } })
  return project?.roles
}
