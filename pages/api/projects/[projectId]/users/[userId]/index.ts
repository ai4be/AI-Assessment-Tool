import type { NextApiRequest, NextApiResponse } from 'next'
import { isConnected, hasProjectAccess, getUserFromRequest } from '@/util/temp-middleware'
import { removeUserAndCreateActivity } from '@/src/models/project'
import templates from '@/util/mail/templates'
import { sendMail } from '@/util/mail'

async function handler (req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const { projectId, userId } = req.query
  const { projectName } = req.body // TODO: ver como pegar o nome do projeto aqui para colocar no corpo do email

  const user = getUserFromRequest(req)

  switch (req.method) {
    case 'DELETE': {
      await removeUserAndCreateActivity(projectId, user?._id, userId)
      const htmlContent = templates.userRemovedProjectHtml(projectName)
      if (user == null) {
        return res.status(422).json({ code: 10007 })
      } else {
        await sendMail(user.email, 'Your user has been removed from project', htmlContent)
        return res.send(200)
      }
    }
    default:
      res.status(404).send({ message: 'not found' })
      break
  }
}

export default isConnected(hasProjectAccess(handler))
