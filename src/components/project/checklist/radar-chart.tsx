
import React, { useEffect, useRef } from 'react'
import {
  Box
} from '@chakra-ui/react'
import Chart from 'chart.js/auto'
import { Category } from '@/src/types/project'

const lineTension = 0.2

const defaultConfig = {
  type: 'radar',
  data: {},
  options: {
    responsive: true,
    plugins: {
      title: {
        display: false
      },
      legend: {
        display: false
      }
    },
    scales: {
      r: {
        pointLabels: {
          color: 'blue',
          font: {
            size: '14px'
            // weight: 'bold'
          }
        },
        angleLines: {
          lineWidth: 5
        },
        grid: {
          circular: true,
          lineWidth: 5,
          drawTicks: false,
          color: ({ tick }: any): string => {
            if (tick.value > 100) return 'transparent'
            return '#E3E3E3'
          }
        },
        ticks: {
          display: false,
          stepSize: 25
        },
        suggestedMin: 0,
        max: 125
      }
    }
  }
}

const radarChartCtxObj: any = {
  chart: null
}

const listenerFn = (e: any): void => {
  if (radarChartCtxObj?.chart?.canvas != null) {
    const size = e?.type === 'beforeprint' ? 512 : 700
    radarChartCtxObj.chart.canvas.parentNode.style.width = `${size}px`
    radarChartCtxObj.chart.canvas.parentNode.style.height = `${size}px`
    radarChartCtxObj.chart.canvas.style.width = `${size}px`
    radarChartCtxObj.chart.canvas.style.height = `${size}px`
    radarChartCtxObj.chart.render()
  }
}

const RadarChart = ({ categories }: { categories: Category[] }): JSX.Element => {
  const el = useRef<HTMLCanvasElement>(null)

  const datasets: any[] = [{
    label: 'Dataset 1',
    data: [],
    borderColor: 'rgb(255, 99, 132)',
    backgroundColor: 'rgba(255, 99, 132, 0.2)',
    lineTension
  }, {
    label: 'Dataset 2',
    data: [],
    borderColor: 'rgb(54, 162, 235)',
    backgroundColor: 'rgba(54, 162, 235, 0.2)',
    lineTension
  }]

  let labels: any[] = []
  if (Array.isArray(categories)) {
    labels = categories.map((cat) => cat.name.split(' '))
    const data1 = categories.map(() => Math.round(Math.random() * 100))
    const data2 = categories.map(() => Math.round(Math.random() * 100))
    datasets[0].data = data1
    datasets[1].data = data2
  }
  const data = {
    labels,
    datasets
  }
  const config = { ...defaultConfig, data }

  useEffect(() => {
    if (el.current != null) {
      const chart = new Chart(el.current, config)
      radarChartCtxObj.chart = chart
      return () => {
        chart.destroy()
        radarChartCtxObj.chart = null
      }
    }
  }, [el])

  useEffect(() => {
    window.addEventListener('beforeprint', listenerFn)
    window.addEventListener('afterprint', listenerFn)
    return () => {
      window.removeEventListener('beforeprint', listenerFn)
      window.removeEventListener('afterprint', listenerFn)
    }
  }, [])

  return (
    <Box position='relative' width='80vw' maxWidth='700px' margin='auto' className='print:max-w-lg'>
      <canvas ref={el} style={{ margin: 'auto', width: '100%' }} />
    </Box>
  )
}

export default RadarChart
