import type { NextApiRequest, NextApiResponse } from 'next'
import { isConnected, getUserFromRequest } from '@/util/temp-middleware'
import Activity from '@/src/models/activity'
import { getUserProjects } from '@/src/models/project'
// import { urlQueryToDBqueryParser } from '@/src/models/mongodb'
// import qs from 'qs'

async function handler (req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const user = getUserFromRequest(req)

  switch (req.method) {
    case 'GET': {
      const { page } = req.query
      // const searchStr = req.url?.replace(/^[^?]+\?/, '') ?? ''
      // const queryObj = qs.parse(searchStr)
      // const { where, sort, limit, page } = urlQueryToDBqueryParser(queryObj, 100, { _id: -1 }, ['_id', 'projectId', 'commentId', 'cardId', 'roleId'])
      // const result = await Activity.getActivitiesForUser(String(user?._id), where, limit, sort, page)
      const projects = await getUserProjects(user?._id)
      if (projects == null || projects.length === 0) res.status(200).send([])
      const result = await Activity.find({ projectId: { $in: projects.map(p => p._id) } }, 100, ['_id', -1], page != null ? String(page) : undefined)
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
