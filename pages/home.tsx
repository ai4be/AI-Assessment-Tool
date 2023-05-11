import Page, { getServerSideProps as getServerSidePropsImported } from '@/pages/projects/index'

export default Page

export async function getServerSideProps (context: any): Promise<any> {
  return await getServerSidePropsImported(context)
}
