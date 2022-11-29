import type { NextApiRequest, NextApiResponse } from 'next'
import { cleanEmail, connectToDatabase, toObjectId } from '@/util/mongodb'
import nodemailer from 'nodemailer'
import { inviteUser } from '@/util/token'
import { getUser } from '@/util/user'
import { unstable_getServerSession } from 'next-auth'
import { authOptions } from './auth/[...nextauth]'
import { isEmailValid } from '@/util/validator'

const EMAIL_FROM: string | undefined = process.env.EMAIL_FROM
const SMTP_HOST: string | undefined = process.env.SMTP_HOST
const SMTP_USER: string | undefined = process.env.SMTP_USER
const SMTP_PASS: string | undefined = process.env.SMTP_PASS

const throwMissingEnvVar = (varName: string): void => {
  throw new Error(`missing ${varName} environment variable`)
}

['EMAIL_FROM', 'SMTP_USER', 'SMTP_PASS'].forEach((key) => process.env[key] == null && throwMissingEnvVar(key))

const sendMail = async (from: string, to: string | string[], subject: string, html: string | null = null, text = null): Promise<void> => {
  const port: number = +(process.env.SMTP_PORT ?? 587)
  const transporter = nodemailer.createTransport({
    host: SMTP_HOST ?? 'smtp.ethereal.email',
    port,
    secure: port === 465, // true for 465, false for other ports
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS
    }
  })
  const mailOptions: any = {
    from, // sender address
    to, // list of receivers
    subject // Subject line
  }
  if (html != null) mailOptions.html = html
  if (text != null) mailOptions.text = text
  // send mail with defined transport object
  const info = await transporter.sendMail(mailOptions)
  console.log(info)
}

function getInvitationHtml (page: string, token: string, email: string, projectId: string, hostname: string): string {
  return `
    <div>
     <div style="height:100px; background-color:#26292c; color: white">
       <p>AI<sub>4<sub>Belgium</p>
     <div>
     <div style="height:200px; background-color:#0079bf;">
       <a href='${hostname}/${page}?token=${token}&email=${email}&projectId=${projectId}'>Your are invited to a project in AI<sub>4<sub>Belgium.</a>
     </div>
     <div style="height:100px; background-color:#26292c;">
  `
}

export default async function handler (req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const { client } = await connectToDatabase()
  const session = await unstable_getServerSession(req, res, authOptions)

  if (session?.user == null) return res.status(401).send({ msg: 'Unauthorized', status: 401 })
  if (!client.isConnected()) return res.status(500).send({ msg: 'DB connection error', status: 500 })

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
      const html = getInvitationHtml(page, tokenInstance.token, email, projectId, String(req.headers.origin))
      await sendMail(String(EMAIL_FROM), email, 'Invitation to AI4Belgium', html)
      return res.status(200).send(null)
    }
    default:
      return res.status(404).send({ message: 'Not found' })
  }
}
