
import nodemailer, { SentMessageInfo } from 'nodemailer'

const EMAIL_FROM: string | undefined = process.env.EMAIL_FROM
const SMTP_HOST: string | undefined = process.env.SMTP_HOST
const SMTP_USER: string | undefined = process.env.SMTP_USER
const SMTP_PASS: string | undefined = process.env.SMTP_PASS

const throwMissingEnvVar = (varName: string): void => {
  throw new Error(`missing ${varName} environment variable`)
}

['EMAIL_FROM', 'SMTP_USER', 'SMTP_PASS'].forEach((key) => process.env[key] == null && throwMissingEnvVar(key))

export const sendMail = async (to: string | string[], subject: string, html: string | null = null, text = null): Promise<SentMessageInfo> => {
  const port: number = +(process.env.SMTP_PORT ?? 587)
  const options = {
    host: SMTP_HOST ?? 'smtp.ethereal.email',
    port,
    secure: port === 465, // true for 465, false for other ports
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS
    }
  }
  const transporter = nodemailer.createTransport(options)
  const mailOptions: any = {
    from: EMAIL_FROM, // sender address
    to, // list of receivers
    subject // Subject line
  }
  if (html != null) mailOptions.html = html
  if (text != null) mailOptions.text = text
  // send mail with defined transport object
  const info = await transporter.sendMail(mailOptions)
  console.log(info)
  return info
}
