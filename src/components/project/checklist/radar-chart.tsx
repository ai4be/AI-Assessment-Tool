
import React, { useContext } from 'react'
import {
  Grid
} from '@chakra-ui/react'
import ProjectContext from '@/src/store/project-context'

// const config = {
//   type: 'radar',
//   data: data,
//   options: {
//     responsive: true,
//     plugins: {
//       title: {
//         display: false
//       }
//     }
//   }
// }

// const data = {
//   labels: labels,
//   datasets: [
//     {
//       label: 'Dataset 1',
//       data: Utils.numbers(NUMBER_CFG),
//       borderColor: Utils.CHART_COLORS.red,
//       backgroundColor: Utils.transparentize(Utils.CHART_COLORS.red, 0.5),
//     },
//     {
//       label: 'Dataset 2',
//       data: Utils.numbers(NUMBER_CFG),
//       borderColor: Utils.CHART_COLORS.blue,
//       backgroundColor: Utils.transparentize(Utils.CHART_COLORS.blue, 0.5),
//     }
//   ]
// }

const RadarChart = (props: any): JSX.Element => {
  const context = useContext(ProjectContext)

  if (Array.isArray(context?.categories)) {
    // const labels = context.categories.map((cat) => cat.name)
    // const dataset = {
    //   label: 'Dataset 1',
    //   data: Utils.numbers(NUMBER_CFG),
    //   borderColor: Utils.CHART_COLORS.red,
    //   backgroundColor: Utils.transparentize(Utils.CHART_COLORS.red, 0.5)
    // }
  }

  return (
    <Grid templateColumns='auto auto' alignItems='center' />
  )
}

export default RadarChart
