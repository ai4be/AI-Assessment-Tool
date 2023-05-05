import type { NextApiRequest, NextApiResponse } from 'next'
import { isConnected, hasProjectAccess, getUserFromRequest } from '@/util/temp-middleware'
import { removeUserAndCreateActivity } from '@/src/models/project'
import templates from '@/util/mail/templates'
import { sendMail } from '@/util/mail'
import { getUser } from '@/src/models/user'

async function handler (req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const { projectId, userId } = req.query
  const { projectName } = req.body
  const user = getUserFromRequest(req)
  const removedUser = await getUser({ _id: userId })

  switch (req.method) {
    case 'DELETE': {
      await removeUserAndCreateActivity(projectId, user?._id, userId)
      const htmlContent = templates.userRemovedProjectHtml(projectName)
      if (removedUser == null) {
        return res.status(422).json({ code: 10007 })
      } else {
        await sendMail(removedUser.email, 'Your user has been removed from project', htmlContent)
        return res.send(200)
      }
    }
    default:
      res.status(404).send({ code: 9006, message: 'Not found' })
      break
  }
}

export default isConnected(hasProjectAccess(handler))
