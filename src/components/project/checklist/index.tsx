import React, { FC } from 'react'
import { Box } from '@chakra-ui/react'
import ChecklistTopBar from '@/src/components/project/checklist/top-bar'
import { Project, Category, Section } from '@/src/types/project'
import CategoryQuestions from '@/src/components/project/checklist/category-questions'
import OverviewComponent from '@/src/components/project/checklist/overview'

interface Props {
  project: Project
  categories: Category[]
  sections: Section[]
}

const Checklist: FC<Props> = (props): JSX.Element => {
  return (
    <Box backgroundColor='white' padding='2rem' paddingTop='1rem' borderRadius='1rem'>
      <OverviewComponent />
      <ChecklistTopBar />
      <CategoryQuestions project={props.project} categories={props.categories} marginTop='1rem' />
    </Box>
  )
}

export default Checklist
