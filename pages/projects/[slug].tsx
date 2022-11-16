import Project from '@/src/components/project'
import { unstable_getServerSession } from 'next-auth/next'
import { authOptions } from '../api/auth/[...nextauth]'
import useSWR from 'swr'
import { useRouter } from 'next/router'
import { fetcher } from '@/util/api'

function Page ({ session }): JSX.Element {
  const router = useRouter()
  const { data, error } = useSWR(`/api/projects/${String(router.query.slug)}`, fetcher)
  return (
    <Project project={data} session={session} />
  )
}

export async function getServerSideProps (context): Promise<any> {
  const session = await unstable_getServerSession(context.req, context.res, authOptions)

  if (session == null) {
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
