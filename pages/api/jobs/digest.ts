import type { NextApiRequest, NextApiResponse } from 'next'
import { hasApiKey } from '@/util/temp-middleware'
import { JobProjectActivityNotification } from '@/src/models/job/job-project-activity-notification'

async function handler (req: NextApiRequest, res: NextApiResponse): Promise<void> {
  switch (req.method) {
    case 'POST': {
      try {
        await JobProjectActivityNotification.createProjectActivityNotificationJobs()
      } catch (error) {
        return res.status(400).send({ message: error.message })
      }
      return res.status(204).end()
    }
    default:
      return res.status(400).send({ message: 'Invalid request' })
  }
}

export default hasApiKey(handler)
