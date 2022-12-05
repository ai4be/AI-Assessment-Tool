import sanitize from 'mongo-sanitize'
import { pick } from 'lodash'
import { ObjectId } from 'mongodb'
import { TABLE_NAME } from './project'
import { toObjectId, connectToDatabase } from './mongodb'

export interface Role {
  _id?: ObjectId
  name: string
  desc: string
  createdAt: number
  userIds?: ObjectId[]
}

export const getRole = async (projectId: ObjectId | string, roleId: ObjectId | string): Promise<Role> => {
  const { db } = await connectToDatabase()
  projectId = toObjectId(projectId)
  roleId = toObjectId(roleId)
  const project = await db.collection(TABLE_NAME).findOne({
    _id: projectId,
    roles: {
      $elemMatch: { _id: roleId }
    }
  },
  { projection: { roles: 1 } })
  return project?.roles.find((role: any) => role._id.toString() === roleId.toString())
}

export const addRole = async (projectId: ObjectId | string, role: { _id?: ObjectId | string, name: string, desc: string }): Promise<Role> => {
  const { db } = await connectToDatabase()
  projectId = toObjectId(projectId)
  role._id = role._id != null ? toObjectId(role._id) : new ObjectId()
  role.name = sanitize(role.name)
  role.desc = sanitize(role.desc ?? '')
  role = pick(role, ['_id', 'name', 'desc']) // allow to use the spreadoperator safely
  await db.collection(TABLE_NAME)
    .updateOne({ _id: projectId }, { $push: { roles: { ...role, userIds: [], createdAt: Date.now() } } })
  const roleUp = await getRole(projectId, role._id)
  return roleUp
}

export const removeRole = async (projectId: ObjectId | string, roldId: ObjectId | string): Promise<boolean> => {
  const { db } = await connectToDatabase()
  projectId = toObjectId(projectId)
  const res = await db
    .collection(TABLE_NAME)
    .updateOne({ _id: projectId }, { $pull: { roles: toObjectId(roldId) } })
  return res.result.ok === 1
}

export const updateRole = async (projectId: ObjectId | string, role: { _id: ObjectId | string, name: string, desc: string }): Promise<boolean> => {
  const { db } = await connectToDatabase()
  const res = await db.collection(TABLE_NAME).updateOne(
    { _id: toObjectId(projectId), 'roles._id': toObjectId(role._id) },
    {
      $set: {
        'roles.$.name': sanitize(role.name),
        'roles.$.desc': sanitize(role.desc)
      }
    }
  )
  return res.result.ok === 1
}

export const addUserToRole = async (projectId: ObjectId | string, roleId: ObjectId | string, userId: ObjectId | string): Promise<boolean> => {
  const { db } = await connectToDatabase()
  const res = await db.collection(TABLE_NAME).updateOne(
    { _id: toObjectId(projectId), 'roles._id': toObjectId(roleId) },
    {
      $addToSet: {
        'roles.$.userIds': toObjectId(userId)
      }
    }
  )
  return res.result.ok === 1
}

export const removeUserFromRole = async (projectId: ObjectId | string, roleId: ObjectId | string, userId: ObjectId | string): Promise<boolean> => {
  const { db } = await connectToDatabase()
  const res = await db.collection(TABLE_NAME).updateOne(
    { _id: toObjectId(projectId), 'roles._id': toObjectId(roleId) },
    {
      $pull: {
        'roles.$.userIds': toObjectId(userId)
      }
    }
  )
  return res.result.ok === 1
}
