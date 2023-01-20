import type { NextApiRequest, NextApiResponse } from 'next'
import { isConnected, getUserFromRequest } from '@/util/temp-middleware'
import { getUserProjects } from '@/src/models/project'
import Activity from '@/src/models/activity'
import { isEmpty } from '@/util/index'

async function handler (req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const user = getUserFromRequest(req)
  const { activityId } = req.query

  switch (req.method) {
    case 'POST': {
      const activity = await Activity.get(activityId as string)
      if (activity == null) return res.status(404).send({ message: 'Activity not found' })
      const projects = await getUserProjects(user?._id, activity.projectId)
      if (isEmpty(projects)) return res.status(403).send({ message: 'You are not allowed to update this activity' })
      await Activity.addUserToSeenBy(activityId as string, String(user?._id))
      return res.status(204).end()
    }
    default:
      return res.status(400).send({ message: 'Invalid request' })
  }
}

export default isConnected(handler)
