import React, { FC } from 'react'
import { Box, Button, Flex, Text } from '@chakra-ui/react'
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
    <Box backgroundColor='white' padding='2rem' paddingTop='1rem' borderRadius='1rem' className='print:p-0'>
      <Flex justifyContent='flex-end' className='print:hidden'><Button backgroundColor='#2811ED' color='white' onClick={() => window?.print()}>Export</Button></Flex>
      <Text color='#1C1E20' fontSize='18px' className='hidden print:block'>1. Overview</Text>
      <OverviewComponent />
      <Text color='#1C1E20' fontSize='18px' className='hidden print:block' marginTop='1rem'>2. Assessment</Text>
      <RadarChart />
      <ChecklistTopBar />
      <Box className='hidden print:block break-before-page' />
      <CategoryQuestions project={props.project} categories={props.categories} marginTop='1rem' />
    </Box>
  )
}

export default Checklist
