import type { NextApiRequest, NextApiResponse } from 'next'
import { isConnected, getUserFromRequest } from '@/util/temp-middleware'
import { getUserProjects } from '@/src/models/project'
import Activity from '@/src/models/activity'
import { isEmpty } from '@/util/index'
import { toObjectId } from '@/src/models/mongodb'
import { urlQueryToDBqueryParser } from '@/util/api'
import qs from 'qs'

const propsToWhere = (prop: string, value: any): any => {
  if (value === `${+value}` && +value === 1) return { $and: [{ [prop]: { $exists: true } }, { [prop]: { $ne: null } }, { [prop]: { $ne: '' } }] }
  if (value === `${+value}` && +value === 0) return { $or: [{ [prop]: { $exists: false } }, { [prop]: { $eq: null } }, { [prop]: { $eq: '' } }] }
  return {}
}

async function handler (req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const user = getUserFromRequest(req)

  switch (req.method) {
    case 'GET': {
      const projects = await getUserProjects(user?._id)
      if (isEmpty(projects)) return res.status(200).send([])

      const usersProjectIds = projects.map((p) => String(p._id))

      const searchStr = req.url?.replace(/^[^?]+\?/, '') ?? ''
      const queryObj = qs.parse(searchStr)
      console.log(searchStr, queryObj)
      const { where, sort, limit, page } = urlQueryToDBqueryParser(queryObj)
      if (typeof where.projectId === 'object') {
        if (where.projectId.$and != null) where.projectId.$and.push({ $in: usersProjectIds.map(toObjectId) })
        else where.projectId.$and = [{ $in: usersProjectIds.map(toObjectId) }, where.projectId]
      } else if (typeof where.projectId === 'string') {
        where.projectId.$and = [{ $in: usersProjectIds.map(toObjectId) }, { $eq: where.projectId }]
      } else {
        where.projectId = { $in: usersProjectIds.map(toObjectId) }
      }

      console.log('where', JSON.stringify(where, null, 2))
      console.log(limit, sort, page)

      const result = await Activity.find(where, limit, sort, page)
      if (result == null) return res.status(200).send([])
      const returnData = {
        data: result.data,
        total: result.count,
        page: result.page,
        limit: result.limit
      }
      return res.status(200).send(returnData)
    }
    default:
      return res.status(400).send({ message: 'Invalid request' })
  }
}

export default isConnected(handler)
