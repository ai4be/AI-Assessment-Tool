import Projects from '@/src/components/projects'
import SideBar from '@/src/components/side-bar'
import { authOptions } from '../api/auth/[...nextauth]'
import useSWR from 'swr'
import { fetcher } from '@/util/api'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { unstable_getServerSession } from 'next-auth/next'
import { useState } from 'react'
import { useBreakpointValue } from '@chakra-ui/react'

const smVariant = { navigation: 'drawer', navigationButton: true }
const mdVariant = { navigation: 'sidebar', navigationButton: false }

export default function Page ({ session }: { session: any }): JSX.Element {
  const { data, error, mutate } = useSWR('/api/projects', fetcher)
  const { data: industries, error: errorIndustries } = useSWR('/api/industries', fetcher)
  const [isSidebarOpen, setSidebarOpen] = useState(false)
  const variants = useBreakpointValue({ base: smVariant, md: mdVariant })

  const toggleSidebar = (): void => setSidebarOpen(!isSidebarOpen)

  return (
    <SideBar
      page='projects'
      variant={variants?.navigation}
      isOpen={isSidebarOpen}
      onClose={toggleSidebar}
      showSidebarButton={variants?.navigationButton}
      onShowSidebar={toggleSidebar}
    >
      <Projects projects={data ?? []} session={session} fetchProjects={mutate} />
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
      session: JSON.parse(JSON.stringify(session)),
      ...await serverSideTranslations(ctx.locale as string, ['buttons', 'navbar', 'projects', 'placeholders', 'api-messages'])
    }
  }
}
