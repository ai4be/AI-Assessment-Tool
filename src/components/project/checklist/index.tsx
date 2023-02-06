import React, { FC } from 'react'
import { Box } from '@chakra-ui/react'
import ChecklistTopBar from '@/src/components/project/checklist/top-bar'
import { Project, Category, Section } from '@/src/types/project'
import CategoryQuestions from '@/src/components/project/checklist/category-questions'
import OverviewComponent from '@/src/components/project/checklist/overview'
import RadarChart from '@/src/components/project/checklist/radar-chart'

interface Props {
  project: Project
  categories: Category[]
  sections: Section[]
}

const Checklist: FC<Props> = (props): JSX.Element => {
  return (
    <Box backgroundColor='white' padding='2rem' paddingTop='1rem' borderRadius='1rem'>
      <OverviewComponent />
      <RadarChart />
      {/* <img src='/radar-chart.jpg' style={{ width: '100%', maxWidth: '800px', margin: 'auto' }} /> */}
      <ChecklistTopBar />
      <CategoryQuestions project={props.project} categories={props.categories} marginTop='1rem' />
    </Box>
  )
}

export default Checklist
