import React from 'react'
import useSWR from 'swr'
import { fetcher } from '@/util/api'
import {
  Box
} from '@chakra-ui/react'
import { DisplayActivity } from '@/src/types/activity'

export const ActivityTimeLine = (): JSX.Element => {
  const { data, error, mutate } = useSWR('/api/activities', fetcher)

  return (
    <>
      {data?.map((activity: DisplayActivity) =>
        <Box key={activity._id} border='1px solid blue'>
          <ul>
            <li>{activity.type}</li>
            <li>{activity.project.name}</li>
            <li>{activity.project._id}</li>
            <li>{activity.createdAt}</li>
          </ul>
        </Box>
      )}
    </>
  )
}
