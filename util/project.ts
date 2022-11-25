
import { connectToDatabase, toObjectId } from './mongodb'
import { ObjectId } from 'mongodb'
import { getUsers, User } from './user'
import sanitize from 'mongo-sanitize'

export const TABLE_NAME = 'projects'

export interface Role {
  _id?: ObjectId
  name: string
  desc: string
  users?: ObjectId[]
}

export interface Project {
  _id?: ObjectId
  name: string
  createdBy?: ObjectId
  createdAt: number
  backgroundImage?: string
  users?: ObjectId[]
  roles?: Role[]
}

export const getProject = async (_id: ObjectId | string): Promise<Project> => {
  const { db } = await connectToDatabase()
  _id = toObjectId(_id)
  return await db.collection(TABLE_NAME).findOne({ _id })
}

export const updateProject = async (_id: ObjectId | string, data: any): Promise<boolean> => {
  const { db } = await connectToDatabase()
  _id = toObjectId(_id)
  const res = await db
    .collection(TABLE_NAME)
    .updateOne({ _id }, { $set: data })
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

export const getRole = async (_id: ObjectId | string, roleId: ObjectId | string): Promise<Role> => {
  const { db } = await connectToDatabase()
  _id = toObjectId(_id)
  roleId = toObjectId(roleId)
  const project = await db.collection(TABLE_NAME).findOne({
    _id,
    roles: {
      $elemMatch: { _id: roleId }
    }
  },
  { projection: { roles: 1 } })
  return project?.roles.find((role: any) => role._id.toString() === roleId.toString())
}

export const addRole = async (_id: ObjectId | string, role: { _id: ObjectId, name: string, desc: string }): Promise<Role> => {
  const { db } = await connectToDatabase()
  _id = toObjectId(_id)
  await db.collection(TABLE_NAME)
    .updateOne({ _id }, { $push: { roles: { ...role, userIds: [], createdAt: Date.now() } } })
  const roleUp = await getRole(_id, role._id)
  return roleUp
}

export const removeRole = async (_id: ObjectId | string, roldId: ObjectId | string): Promise<boolean> => {
  const { db } = await connectToDatabase()
  _id = toObjectId(_id)
  const res = await db
    .collection(TABLE_NAME)
    .updateOne({ _id }, { $pull: { roles: toObjectId(roldId) } })
  return res.result.ok === 1
}

export const updateRole = async (_id: ObjectId | string, role: { _id: ObjectId | string, name: string, desc: string }): Promise<boolean> => {
  const { db } = await connectToDatabase()
  const res = await db.collection(TABLE_NAME).updateOne(
    { _id: toObjectId(_id), 'roles._id': toObjectId(role._id) },
    {
      $set: {
        'roles.$.name': sanitize(role.name),
        'roles.$.description': sanitize(role.desc)
      }
    }
  )
  return res.result.ok === 1
}
