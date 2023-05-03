import { Box, Image } from '@chakra-ui/react'

export const WavesOutline = (): JSX.Element => {
  return (
    <Box bgColor='rgba(20, 17, 24)'>
      <Image width='100%' height='250px' src='/frontpage/waves.svg' alt='divider image' />
    </Box>
  )
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
    <Box bgColor='rgba(20, 17, 24)'>
      <div className='irrXeY cAuVNc'>
        <svg preserveAspectRatio='none' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 440 52' style={{ transform: 'translateY(2px) scale(1.1)' }} className='fUfQTM'>
          <path d='M220 1C133.228-1.86 0 33 0 33v18.5h439.5V12s-24.077 14.898-41 21C331.878 57.02 290.781 3.333 220 1z' />
        </svg>
      </div>
    </Box>
  )
}

export const WavePurple = (): JSX.Element => {
  return (
    <Box bgColor='rgba(20, 17, 23)'>
      <section className='fVQDoZ'>
        <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 2986 393' className='Title__BackgroundSwoop-sc-p0p5jt-5 dZeCoq'>
          <path
            fill='hsl(267deg 50% 11%)'
            d='M573.5 94C346.756 91.146.5 0 .5 0v393h2985V222s-334.14-75.852-530.5-94c-222.28-20.544-346.81 47.19-570 43-327.93-6.157-501.55-136.097-829.5-131.5-189.414 2.655-292.583 56.884-482 54.5z'
          />
        </svg>
        <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 2839 579' className='Title__ForegroundSwoop-sc-p0p5jt-4 lffttN'>
          <g clipPath='url(#clip0)'>
            <path
              fill='var(--color-background)'
              d='M2095 482c344.77-31.423 744-482 744-482v578.5H-127s0-214 331-256C392.489 298.583 452.227 451.156 625.5 482c332.323 59.155 508.95-108.5 846.5-108.5 237.5 0 374.02 131.192 623 108.5z'
            />
          </g>
        </svg>
      </section>
    </Box>
  )
}
