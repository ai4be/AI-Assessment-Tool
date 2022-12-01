import type { NextApiRequest, NextApiResponse } from 'next'
import { cleanEmail, toObjectId } from '@/util/mongodb'
import { inviteUser } from '@/util/token'
import { getUser } from '@/util/user'
import { unstable_getServerSession } from 'next-auth'
import { authOptions } from './auth/[...nextauth]'
import { isEmailValid } from '@/util/validator'
import { sendMail } from '@/util/mail'
import templates from '@/util/mail/templates'
import { isConnected } from '@/util/temp-middleware'

export default async function handler (req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const session = await unstable_getServerSession(req, res, authOptions)

  const canProceed = await isConnected(req, res)
  if (canProceed !== true) return

  switch (req.method) {
    case 'POST': {
      let { email, projectId } = req.body
      if (email == null || projectId == null || !isEmailValid(email)) return res.status(400).json({ error: 'missing properties' })
      email = email != null ? cleanEmail(email) : email
      projectId = projectId != null ? toObjectId(projectId) : projectId
      const creator = await getUser({ email: String(session.user.email) })
      let tokenInstance
      try {
        tokenInstance = await inviteUser(projectId, email, creator._id)
      } catch (error) {
        return res.status(400).json({ error: 'duplicate' })
      }
      const user = await getUser({ email })
      const page = user != null ? 'login' : 'signup'
      const html = templates.invitation(page, tokenInstance.token, email, projectId, String(req.headers.origin))
      await sendMail(email, 'Invitation to AI4Belgium', html)
      return res.status(200).send(null)
    }
    default:
      return res.status(404).send({ message: 'Not found' })
  }
}
