import Home from '@/src/components/home'
import { getSession } from 'next-auth/react'
import SideBar from '@/src/components/side-bar'
// import useSWR from 'swr'

const PAGE = 'home'

export default function HomePage ({ session }) {
  return (
    <SideBar page={PAGE}>
      <Home />
    </SideBar>
  )
}

export async function getServerSideProps (context) {
  const session = await getSession(context)

  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false
      }
    }
  }

  return {
    props: { session }
  }
}
