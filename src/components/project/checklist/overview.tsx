
import React from 'react'
import {
  Box,
  Text, Progress, Grid, GridItem
} from '@chakra-ui/react'
import style from '@/src/components/project/checklist/overview.module.css'
import { Category } from '@/src/types/project'

const OverviewComponent = ({ categories, scoresPerCatId }: { categories: Category[], scoresPerCatId: { [key: string]: number } }): JSX.Element => {
  const content = Array.isArray(categories)
    ? categories.map(cat => (
      <GridItem key={cat._id} colSpan={1} padding='1rem' className='print:p-0.75'>
        <Text color='#17075F' as='b' marginBottom='0.5rem' display='block' className='print:text-sm'>{cat.name}</Text>
        <Box display='flex' justifyContent='space-between' alignItems='center'>
          <Box width='90%'>
            <Progress value={(scoresPerCatId?.[cat._id] ?? 0) * 100} height='0.9rem' borderRadius='lg' className={style.overview} />
          </Box>
          <Text color='lightgrey' marginLeft='0.5rem' fontSize='sm' className='print:text-xs'>{((scoresPerCatId?.[cat._id] ?? 0) * 100).toFixed(0)}%</Text>
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
