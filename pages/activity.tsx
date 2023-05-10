import * as React from 'react'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/pages/api/auth/[...nextauth]'

export function Page (): JSX.Element {
  return (<></>)
}

export async function getServerSideProps (ctx: any): Promise<any> {
  const session = await getServerSession(ctx.req, ctx.res, authOptions)

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
