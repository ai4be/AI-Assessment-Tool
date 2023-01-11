import { connectToDatabase, toObjectId } from './mongodb'
import { ObjectId } from 'mongodb'
import sanitize from 'mongo-sanitize'
import { Comment as CommentTypeDef } from '@/src/types/comment'
import Activity from './activity'

export const TABLE_NAME = 'comments'

export const formatWhere = (where: string | ObjectId | any): any => {
  where = { ...where }
  where = sanitize(where)
  if (where instanceof ObjectId || typeof where === 'string') {
    where = { _id: toObjectId(where) }
  } else if (where != null) {
    ['_id', 'cardId', 'projectId', 'userId', 'userIds'].forEach(key => {
      if (where[key] != null) where[key] = Array.isArray(where[key]) ? where[key].map(toObjectId) : toObjectId(where[key])
    })
  }
  return where
}

export const getComment = async (where: string | ObjectId | any): Promise<CommentTypeDef> => {
  const formattedWhere = formatWhere(where)
  const { db } = await connectToDatabase()
  return await db.collection(TABLE_NAME).findOne(formattedWhere)
}

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class Comment {
  static TABLE_NAME = TABLE_NAME

  static getUserIdsFromMentions (comment: CommentTypeDef): ObjectId[] {
    /*
    * (?<=@\[[^\]]+\]\() - Lookbehind for @ followed by [any character except ]] followed by (. This is the start of the mention
    * [^)]+ - Any character except ) one or more times
    * (?=\)) - Lookahead for ). This is the end of the mention
    */
    return comment?.text?.match(/(?<=@\[[^\]]+\]\()[^)]+(?=\))/g)?.map(toObjectId) ?? []
  }

  static async get (where: any): Promise<CommentTypeDef> {
    return await getComment(where)
  }
}

export const getComments = async (where: any): Promise<CommentTypeDef[]> => {
  const { db } = await connectToDatabase()
  where = sanitize(where)
  if (where._id != null) where._id = toObjectId(where._id)
  if (where.projectId != null) where.projectId = toObjectId(where.projectId)
  if (where.cardId != null) where.cardId = toObjectId(where.cardId)
  return await db.collection(TABLE_NAME).find(where).toArray()
}

export const createCommentAndActivity = async (data: any): Promise<CommentTypeDef | null> => {
  const comment = await createComment(data)
  if (comment != null) void Activity.createCommentCreateActivity(comment)
  return comment
}

export const createComment = async (data: any): Promise<CommentTypeDef | null> => {
  const { db } = await connectToDatabase()
  data = sanitize(data)
  data.projectId = toObjectId(data.projectId)
  data.userId = toObjectId(data.userId)
  data.cardId = toObjectId(data.cardId)
  data.createdAt = new Date()
  let localData: any = {};
  ['projectId', 'userId', 'text', 'cardId', 'createdAt', 'questionId'].forEach(k => {
    if (data[k] != null) localData[k] = data[k]
  })
  localData = sanitize(localData)
  localData.userIds = Comment.getUserIdsFromMentions(localData)
  const result = await db.collection(TABLE_NAME).insertOne(localData)
  if (result.result.ok === 1) {
    const comment = await db.collection(TABLE_NAME).findOne({ _id: result.insertedId })
    return comment
  }
  return null
}

export const updateCommentAndCreateActivity = async (_id: ObjectId | string, data: any): Promise<boolean> => {
  const updated = await updateComment(_id, data)
  if (updated) void Activity.createCommentUpdateActivity(_id)
  return updated
}

export const updateComment = async (_id: ObjectId | string, data: any): Promise<boolean> => {
  const { db } = await connectToDatabase()
  _id = toObjectId(_id)
  const { text }: any = data
  const localData: any = sanitize({ text })
  localData.updatedAt = Date.now()
  localData.userIds = Comment.getUserIdsFromMentions(localData)
  const res = await db
    .collection(TABLE_NAME)
    .updateOne({ _id }, { $set: localData })
  return res.result.ok === 1
}

export const deleteCommentAndCreateActivity = async (_id: ObjectId | string): Promise<boolean> => {
  const deleted = await deleteComment(_id)
  if (deleted) void Activity.createCommentDeleteActivity(_id)
  return deleted
}

export const deleteComment = async (_id: ObjectId | string): Promise<boolean> => {
  const { db } = await connectToDatabase()
  _id = toObjectId(_id)
  const res = await db
    .collection(TABLE_NAME)
    .deleteOne({ _id })
  return res.result.ok === 1
}

export const deleteComments = async (where: any): Promise<boolean> => {
  const { db } = await connectToDatabase()
  where = sanitize(where)
  if (where._id != null) where._id = Array.isArray(where._id) ? where._id.map(toObjectId) : toObjectId(where._id)
  if (where.projectId != null) where.projectId = toObjectId(where.projectId)
  const res = await db
    .collection(TABLE_NAME)
    .deleteMany(where)
  return res.result.ok === 1
}
