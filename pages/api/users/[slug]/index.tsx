import type { NextApiRequest, NextApiResponse } from 'next'
import { getUser, updateUser } from '@/util/user'
import { isConnected } from '@/util/temp-middleware'
import { unstable_getServerSession } from 'next-auth'
import { authOptions } from 'pages/api/auth/[...nextauth]'
import { getUserProjects } from '@/util/project'
import isEmpty from 'lodash.isempty'

export default async function handler (req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const session = await unstable_getServerSession(req, res, authOptions)
  const { slug } = req.query

  const canProceed = await isConnected(req, res)
  if (canProceed !== true) return

  switch (req.method) {
    case 'GET': {
      let user: any = await getUser({ email: String(session?.user?.email) })
      if (slug !== 'me') {
        const projects = await getUserProjects(user._id)
        const userIds = projects.map((project) => project.users).flat()
        if (!userIds.includes(slug)) return res.status(403).json({ error: 'You are not authorized to view this user' })
        user = await getUser({ _id: slug })
      }
      return res.status(200).json(user)
    }
    case 'PATCH': {
      const { firstName, lastName, avatar, xsAvatar } = req.body
      const update = { firstName, lastName, avatar, xsAvatar }
      if (isEmpty(update)) res.status(204).end()
      const updated = await updateUser(slug, update)
      return res.status(204).end()
    }
    default:
      return res.status(404).send({ message: 'Not found' })
  }
}
