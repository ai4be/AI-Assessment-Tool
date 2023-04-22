import type { NextApiRequest, NextApiResponse } from 'next'
import { hasApiKey } from '@/util/temp-middleware'
import Job from '@/src/models/job/index'

async function handler (req: NextApiRequest, res: NextApiResponse): Promise<void> {
  switch (req.method) {
    case 'POST': {
      try {
        await Job.findAndExecuteJobs()
      } catch (error) {
        return res.status(400).send({ message: (error as any).message })
      }
      return res.status(204).end()
    }
    default:
      return res.status(400).send({ message: 'Invalid request', code: 9002 })
  }
}

export default hasApiKey(handler)
