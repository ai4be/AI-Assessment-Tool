import Board from '@/src/components/board'
import { unstable_getServerSession } from 'next-auth/next'
import { authOptions } from '../api/auth/[...nextauth]'
import useSWR from 'swr'
import { useRouter } from 'next/router'

const fetcher = url => fetch(url).then(r => r.json())

function BoardPage ({ session }) {
  const router = useRouter()
  const { data, error } = useSWR(`/api/boards/${router.query.slug}`, fetcher)
  return (
    <Board board={data} />
  )
}

export async function getServerSideProps (context) {
  const session = await unstable_getServerSession(context.req, context.res, authOptions)

  if (!session) {
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

export default BoardPage
