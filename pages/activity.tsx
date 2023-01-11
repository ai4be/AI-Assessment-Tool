import * as React from 'react'
import { authOptions } from './api/auth/[...nextauth]'
import { unstable_getServerSession } from 'next-auth/next'
import { ActivityTimeLine } from '@/src/components/activity'

export function Page (): JSX.Element {
  return (<ActivityTimeLine />)
}

export async function getServerSideProps (ctx): Promise<any> {
  const session = await unstable_getServerSession(ctx.req, ctx.res, authOptions)

  if (session?.user == null) {
    return {
      redirect: {
        destination: '/login',
        permanent: false
      }
    }
  }
  return {
    props: {
      session: JSON.parse(JSON.stringify(session))
    }
  }
}

export default Page
