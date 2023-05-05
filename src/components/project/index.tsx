import React, { FC, useState } from 'react'
import { Box, useBreakpointValue } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import ProjectColumns from '@/src/components/project/columns'
import { ProjectContextProvider } from '@/src/store/project-context'
import SideBar from '@/src/components/project/side-bar'
import NavBar from '@/src/components/navbar'
import ProgressBar, { SECTION_CHECKLIST } from '@/src/components/project/progress-bar'
import { Category, Project, Section } from '@/src/types/project'
import { QueryFilterKeys } from '@/src/components/project/project-bar/filter-menu'
import Checklist from '@/src/components/project/checklist'

const smVariant = { navigation: 'menu', navigationButton: true }
const mdVariant = { navigation: 'sidebar', navigationButton: false }

interface Props {
  project: Project
  session: any
  categories: Category[]
  sections: Section[]
}

const ProjectComponent: FC<Props> = (props): JSX.Element => {
  const router = useRouter()
  const { [QueryFilterKeys.STAGE]: stage } = router.query ?? {}
  const [isSidebarOpen] = useState(false)
  const variants = useBreakpointValue({ base: smVariant, md: mdVariant })

  const el = (
    <Box boxShadow='base' rounded='lg' p='1em' pl='0' bgColor='white'>
      <Box display='flex' position='relative'>
        <SideBar
          page='projects'
          variant={variants?.navigation}
          isOpen={isSidebarOpen}
          showSidebarButton={variants?.navigationButton}
        />
        <ProjectColumns project={props.project} />
      </Box>
    </Box>
  )

  return (
    <Box bgColor='#F7F7F7'>
      {props.project != null &&
        <ProjectContextProvider {...props}>
          <NavBar showSidebarButton={false} bg='white' />
          <Box display='flex' alignItems='center' flexDirection='column' ml='2rem' mr='2rem' className='print:m-0'>
            <Box width='100%' my='1%' className='print:hidden'>
              <ProgressBar />
            </Box>
            {stage === SECTION_CHECKLIST.toUpperCase()
              ? <Checklist project={props.project} categories={props.categories} sections={props.sections} />
              : el}
          </Box>
        </ProjectContextProvider>}
    </Box>
  )
}

export default ProjectComponent
