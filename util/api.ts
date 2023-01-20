import sanitize from 'mongo-sanitize'
import { isEmpty } from '@/util/index'

export const fetcher = async (url: string, options?: any): Promise<any> => await fetch(url).then(async r => await r.json())

export enum HTTP_METHODS {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  PATCH = 'PATCH'
}

export const defaultFetchOptions: any = {
  method: HTTP_METHODS.GET,
  mode: 'cors',
  cache: 'no-cache',
  credentials: 'same-origin',
  headers: {
    'Content-Type': 'application/json'
  },
  redirect: 'follow',
  referrerPolicy: 'no-referrer'
}

const operators = ['in', '$gt', '$gte', 'lt', 'lte', 'ne', 'nin', 'eq', 'exists']

export function urlQueryToDBqueryParser (query: any, defaultLimit = 100, defaultSort = { _id: -1 }): any {
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
      if (typeof value === 'string') {
        value = value.split(',')
      }
      if (Array.isArray(value)) {
        value = value.map(v => sanitize(v))
        if (value.length === 0) continue
        if (value.length === 1) where[sanitizedKey] = value[0]
        else where[sanitizedKey] = { $in: value }
      } else if (typeof value === 'object') {
        const andQ: any = {}
        for (const op in value) {
          if (!operators.includes(op)) continue
          const opMongo = `$${op}`
          let opVal = value[op].split(',').map(v => sanitize(v))
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
