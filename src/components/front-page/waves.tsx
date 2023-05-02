import { Image } from '@chakra-ui/react'

export const WavesOutline = (): JSX.Element => {
  return (<Image width='100%' height='250px' src='/frontpage/waves.svg' alt='brand logo' />)
}

export const WaveGrayToBlack = (): JSX.Element => {
  return (
    <div className='irrXeY bBGrjK'>
      <svg preserveAspectRatio='none' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 441 73' className='fUfQTM'>
        <path d='M133 39.5C80.795 39.858 0 26 0 26V0h440.5v51.5S427.546 62.233 418 67c-49.342 24.641-78.218-41.116-133-47.5-59.469-6.93-92.13 19.589-152 20z' />
      </svg>
    </div>
  )
}

export const WaveBlackToGray = (): JSX.Element => {
  return (
    <div className='irrXeY cAuVNc'>
      <svg preserveAspectRatio='none' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 440 52' className='fUfQTM'>
        <path d='M220 1C133.228-1.86 0 33 0 33v18.5h439.5V12s-24.077 14.898-41 21C331.878 57.02 290.781 3.333 220 1z' />
      </svg>
    </div>
  )
}
