import type { NextApiRequest, NextApiResponse } from 'next'
import { isConnected, getUserFromRequest } from '@/util/temp-middleware'
import { getUserProjects } from '@/src/models/project'
import Activity from '@/src/models/activity'
import { isEmpty } from '@/util/index'

async function handler (req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const user = getUserFromRequest(req)
  const { limit = 500, page } = req.query

  switch (req.method) {
    case 'GET': {
      const projects = await getUserProjects(user?._id)
      console.log(projects)
      if (isEmpty(projects)) return res.status(200).send([])
      console.log('search params', { projectId: { $in: projects.map((p) => p._id) } }, +limit, ['_id', -1])
      const result = await Activity.find({ projectId: { $in: projects.map((p) => p._id) } }, +limit, ['_id', -1])
      console.log(result)
      if (result == null) return res.status(200).send([])
      const data = result.data as any
      data.total = result.count
      data.page = result.page
      data.limit = result.limit
      return res.status(200).send(data)
    }
    default:
      return res.status(404).send({ message: 'Not found' })
  }
}

export default isConnected(handler)
