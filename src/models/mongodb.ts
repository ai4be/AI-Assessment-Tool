import sanitize from 'mongo-sanitize'
import { Db, MongoClient, ObjectId } from 'mongodb'

const { MONGODB_URI, MONGODB_DB, LOCAL_MONGODB } = process.env

if (MONGODB_URI == null || MONGODB_URI === '') {
  throw new Error('Please define the MONGODB_URI environment variable inside the .env files')
}

if (MONGODB_DB == null || MONGODB_DB === '') {
  throw new Error('Please define the MONGODB_DB environment variable inside the .env files')
}

const globalAny: any = global

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = globalAny.mongo

if (cached == null) {
  cached = globalAny.mongo = { conn: null, promise: null }
}

export async function connectToDatabase (): Promise<{ client: MongoClient, db: Db }> {
  if (cached.conn instanceof MongoClient) {
    return cached.conn
  }

  if (cached.promise == null) {
    const opts = {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }

    const mongoURL: string = String(
      process.env.NODE_ENV === 'development' ? LOCAL_MONGODB : MONGODB_URI
    )

    cached.promise = MongoClient.connect(mongoURL, opts).then((client) => {
      return {
        client,
        db: client.db(MONGODB_DB)
      }
    })
  }
  cached.conn = await cached.promise
  return cached.conn
}

export const toObjectId = (_id: string | ObjectId): ObjectId => typeof _id === 'string' ? ObjectId(sanitize(_id)) : _id

export const cleanEmail = (email: string): string => sanitize(email.trim().toLowerCase())
export const cleanText = (email: string): string => sanitize(email.trim())
