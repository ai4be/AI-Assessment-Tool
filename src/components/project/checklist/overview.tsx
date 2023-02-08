
import React, { useContext } from 'react'
import {
  Box,
  Text, Progress, Grid, GridItem
} from '@chakra-ui/react'
import ProjectContext from '@/src/store/project-context'
import style from '@/src/components/project/checklist/overview.module.css'

const OverviewComponent = (props: any): JSX.Element => {
  const context = useContext(ProjectContext)

  const content = Array.isArray(context?.categories)
    ? context.categories.map((cat, index) => (
      <GridItem key={cat._id} colSpan={1} padding='1rem' className='print:p-0.75'>
        <Text color='#17075F' as='b' marginBottom='0.5rem' display='block' className='print:text-sm'>{cat.name}</Text>
        <Box display='flex' justifyContent='space-between' alignItems='center'>
          <Box width='90%'>
            <Progress value={80} height='0.9rem' borderRadius='lg' className={style.overview} />
          </Box>
          <Text color='lightgrey' marginLeft='0.5rem' fontSize='sm' className='print:text-xs'>80%</Text>
        </Box>

      </GridItem>
    ))
    : null

  return (
    <Grid templateColumns='auto auto' alignItems='center'>
      {content}
    </Grid>
  )
}

export default OverviewComponent
