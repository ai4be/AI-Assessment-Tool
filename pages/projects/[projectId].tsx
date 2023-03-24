import useSWR from 'swr'
import { useRouter } from 'next/router'
import { unstable_getServerSession } from 'next-auth/next'
import { fetcher } from '@/util/api'
import Project from '@/src/components/project'
import { authOptions } from 'pages/api/auth/[...nextauth]'
import { categories } from 'pages/api/categories'
import { sections } from 'pages/api/sections'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

function Page ({ session }): JSX.Element {
  const router = useRouter()
  const [projectId] = Array.isArray(router.query.projectId) ? router.query.projectId : [router.query.projectId, null]
  const { data, error } = useSWR(`/api/projects/${String(projectId)}`, fetcher)
  if (error != null) void router.push('/error')
  return (
    <Project project={data} session={session} categories={categories} sections={sections} />
  )
}

export async function getServerSideProps (ctx): Promise<any> {
  const session = await unstable_getServerSession(ctx.req, ctx.res, authOptions)

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
      session: JSON.parse(JSON.stringify(session)),
      ...await serverSideTranslations(ctx.locale as string, ['buttons', 'navbar', 'projects', 'placeholders', 'project-settings', 'exceptions', 'dialogs', 'api-messages', 'titles', 'filter-sort', 'sidebar', 'settings', 'column-dashboard'])
    }
  }
}

export default Page
