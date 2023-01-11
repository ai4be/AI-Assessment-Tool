import React from 'react'
import useSWR from 'swr'
import { fetcher } from '@/util/api'
import {
  Box
} from '@chakra-ui/react'
import { Activity } from '@/src/types/activity'

export const ActivityTimeLine = (): JSX.Element => {
  const { data, error, mutate } = useSWR('/api/activities', fetcher)

  return (
    <>
      {data?.map((activity: Activity) =>
        <Box key={activity._id}>
          {JSON.stringify(activity)}
        </Box>
      )}
    </>
  )
}
