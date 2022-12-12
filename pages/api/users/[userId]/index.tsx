import type { NextApiRequest, NextApiResponse } from 'next'
import { getUser, updateUser } from '@/util/user'
import { isConnected } from '@/util/temp-middleware'
import { unstable_getServerSession } from 'next-auth'
import { authOptions } from 'pages/api/auth/[...nextauth]'
import { getUserProjects } from '@/util/project'
import isEmpty from 'lodash.isempty'

export default async function handler (req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const session = await unstable_getServerSession(req, res, authOptions)
  const { userId } = req.query

  const canProceed = await isConnected(req, res)
  if (canProceed !== true) return

  let user: any = await getUser({ email: String(session?.user?.email) })
  switch (req.method) {
    case 'GET': {
      if (userId !== 'me') {
        const projects = await getUserProjects(user._id)
        const userIds = projects.map((project) => project.users).flat().map(uid => String(uid))
        if (!userIds.includes(String(userId))) return res.status(403).json({ error: 'You are not authorized to view this user' })
        user = await getUser({ _id: userId })
      }
      return res.status(200).json(user)
    }
    case 'PATCH': {
      if (String(user._id) !== userId) return res.status(403).json({ msg: 'You are not authorized to update this user' })
      const { firstName, lastName, avatar, xsAvatar } = req.body
      const update = { firstName, lastName, avatar, xsAvatar }
      if (isEmpty(update)) res.status(204).end()
      const updated = await updateUser(userId, update)
      return res.status(204).end()
    }
    default:
      return res.status(404).send({ message: 'Not found' })
  }
}
