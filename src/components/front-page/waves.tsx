import { Image } from '@chakra-ui/react'

export const WavesOutline = (): JSX.Element => {
  return (<Image width='100%' height='250px' src='/frontpage/waves.svg' alt='brand logo' />)
}
export const Waves = ({ colour1 = 'rgba(255,255,255,0.5)', colour2 = 'rgba(255,255,255,0.7)', colour3 = 'rgba(255,255,255,0.3)', colour4 = 'rgba(14,16,18)' }): JSX.Element => {
  return (
    <div>
      <svg className='waves' xmlns='http://www.w3.org/2000/svg' viewBox='0 24 150 28' preserveAspectRatio='none' shapeRendering='auto'>
        <defs>
          <path id='gentle-wave' d='M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z' />
        </defs>
        <g className='parallax'>
          <use xlinkHref='#gentle-wave' x='48' y='3' fill={colour1} />
          <use xlinkHref='#gentle-wave' x='48' y='0' fill={colour2} />
          <use xlinkHref='#gentle-wave' x='48' y='5' fill={colour3} />
          <use xlinkHref='#gentle-wave' x='48' y='7' fill={colour4} />
        </g>
      </svg>
    </div>
  )
}
