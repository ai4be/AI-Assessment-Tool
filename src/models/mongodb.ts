import sanitize from 'mongo-sanitize'
import { Db, MongoClient, ObjectId } from 'mongodb'
import { isEmpty } from '@/util/index'

const { MONGODB_URI, MONGODB_DB } = process.env

if (MONGODB_URI == null || MONGODB_URI === '') {
  throw new Error('Please define the MONGODB_URI environment variable inside the .env files')
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = {} as any

if (cached == null) {
  cached = { conn: null, promise: null, uri: null }
}

export async function connectToDatabase (mongoDbUri?: string, dbName?: string | null): Promise<{ client: MongoClient, db: Db }> {
  if (cached.conn?.client instanceof MongoClient) {
    let res = null
    try {
      res = await cached.conn.client.db().admin().ping()
    } catch (e) {
      res = null
    }
    if (res?.ok === 1 && ((mongoDbUri != null && cached.conn.uri === mongoDbUri) || mongoDbUri == null)) return cached.conn
    else {
      await cached.conn.client.close()
      cached = { conn: null, promise: null, uri: null }
    }
  }
  mongoDbUri = mongoDbUri ?? String(MONGODB_URI)
  dbName = dbName ?? (MONGODB_DB != null ? String(MONGODB_DB) : null)

  if (cached.promise == null) {
    const opts = {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }

    cached.promise = MongoClient.connect(mongoDbUri, opts).then(client => {
      const db = typeof dbName === 'string' && dbName.length > 0 ? client.db(dbName) : client.db()
      return {
        client,
        db,
        uri: mongoDbUri
      }
    })
  }
  cached.conn = await cached.promise
  return cached.conn
}

export const toObjectId = (_id: string | ObjectId): ObjectId => typeof _id === 'string' ? ObjectId(sanitize(_id)) : _id

export const cleanEmail = (email: string): string => sanitize(email.trim().toLowerCase())
export const cleanText = (txt: string): string => sanitize(txt.trim())

export const addToWhere = (where: any, key: string, value: any, operator: string = '$eq'): void => {
  if (typeof where[key] === 'object') {
    if (where[key][operator] == null) where[key][operator] = value
    else {
      where.$and = where.$and ?? []
      where.$and.push({ [key]: { [operator]: value } }, { [key]: where[key] })
    }
  } else if (typeof where[key] === 'string' || where[key] instanceof ObjectId) {
    where[key] = { [operator]: value, $eq: where[key] }
  } else {
    where[key] = { operator: value }
  }
}

const operators = ['in', '$gt', '$gte', 'lt', 'lte', 'ne', 'nin', 'eq', 'exists']

export function urlQueryToDBqueryParser (query: any, defaultLimit = 100, defaultSort = { _id: -1 }, objectIdProps: string[] = []): any {
  let sort: any = {}
  let limit = defaultLimit
  let page = null
  const where = {}
  const keys = Object.keys(query)
  for (const k of keys) {
    let value = query[k]
    if (k === 'limit') {
      limit = `${+value}` === `${String(value)}` ? +value : limit
      limit = Math.min(limit, defaultLimit)
    } else if (k === 'sort') {
      const strArr: string[] = Array.isArray(value) ? value : value.split(',')
      for (const v of strArr) {
        let order = 1
        let field = v
        if (v.startsWith('-')) {
          order = -1
          field = v.replace(/^-/, '')
        }
        field = sanitize(field)
        sort[field] = order
      }
    } else if (k === 'page') {
      page = value
    } else {
      const sanitizedKey = sanitize(k)
      const isObjectIdProp = objectIdProps.includes(sanitizedKey)
      if (typeof value === 'string') {
        value = value.split(',')
      }
      if (Array.isArray(value)) {
        value = value.map(v => sanitize(v))
        if (isObjectIdProp) value = value.map(v => String(v).length === 24 ? v : null).filter(v => v != null).map(v => toObjectId(v))
        if (value.length === 0) continue
        if (value.length === 1) where[sanitizedKey] = value[0]
        else where[sanitizedKey] = { $in: value }
      } else if (typeof value === 'object') {
        const andQ: any = {}
        for (const op in value) {
          if (!operators.includes(op)) continue
          const opMongo = `$${op}`
          let opVal = value[op].split(',').map(v => sanitize(v))
          if (isObjectIdProp) opVal = opVal.map(v => String(v).length === 24 ? v : null).filter(v => v != null).map(v => toObjectId(v))
          if (opVal.length === 1) opVal = opVal[0]
          andQ[opMongo] = opVal
        }
        where[sanitizedKey] = andQ
      }
    }
  }
  if (isEmpty(sort)) sort = defaultSort
  return { where, sort, limit, page }
}
