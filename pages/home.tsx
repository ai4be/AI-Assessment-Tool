import Projects from '@/src/components/projects'
import SideBar from '@/src/components/side-bar'
import { authOptions } from './api/auth/[...nextauth]'
import useSWR from 'swr'
import { fetcher } from '@/util/api'
import { unstable_getServerSession } from 'next-auth/next'

export default function Page ({ session }: { session: any, emailVerified: boolean }): JSX.Element {
  const { data, error, mutate } = useSWR('/api/projects', fetcher)
  const { data: industries, error: errorIndustries } = useSWR('/api/industries', fetcher)
  return (
    <SideBar page='projects'>
      <Projects projects={data || []} session={session} fetchProjects={mutate} />
    </SideBar>
  )
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
