import Home from '@/src/components/home'
import { getSession } from 'next-auth/react'
import SideBar from '@/src/components/side-bar'

const PAGE = 'home'

export default function HomePage ({ session }): JSX.Element {
  return (
    <SideBar page={PAGE}>
      <Home />
    </SideBar>
  )
}

export async function getServerSideProps (context): Promise<any> {
  const session = await getSession(context)

  if (session == null) {
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
