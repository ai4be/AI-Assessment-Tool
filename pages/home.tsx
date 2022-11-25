import Projects from '@/src/components/projects'
import { unstable_getServerSession } from 'next-auth/next'
import { authOptions } from './api/auth/[...nextauth]'
import SideBar from '@/src/components/side-bar'
import useSWR from 'swr'
import { fetcher } from '@/util/api'

export default function Page ({ session }): JSX.Element {
  const { data, error, mutate } = useSWR('/api/projects', fetcher)
  const { data: industries, error: errorIndustries } = useSWR('/api/industries', fetcher)
  return (
    <SideBar page='projects'>
      <Projects projects={data || []} session={session} fetchProjects={mutate} />
    </SideBar>
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
