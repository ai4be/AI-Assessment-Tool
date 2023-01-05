import React, { FC, useContext } from 'react'
import { Flex } from '@chakra-ui/react'
import ProjectContext from '@/src/store/project-context'

const borderWidth = '5px'
const borderRadiusOutside = '10px'
const borderRadiusInner = '50px'
const marginLeft = '10px'

const gradientBGC = 'linear-gradient(89.87deg, #182FFF 7.28%, rgba(234, 226, 253, 0) 158.64%)'

const ProgressBar: FC<any> = (): JSX.Element => {
  const { stageClickHandler, stage, stages } = useContext(ProjectContext)
  const SECTIONS: string[] = ['all', ...(stages != null ? stages : []), 'checklist']
  const SECTIONS_MAX_IDX = SECTIONS.length - 1
  console.log(stage)
  return (
    <Flex width='100%' justifyContent='center' alignItems='center' backgroundColor='white'>
      {SECTIONS.map((s, idx) => (
        <Flex
          onClick={(): void => stageClickHandler(s.toUpperCase())}
          cursor='pointer'
          key={s + String(idx)}
          width={idx > 0 ? `calc(${100 / SECTIONS.length}% + ${marginLeft})` : `${100 / SECTIONS.length}%`}
          height='38px'
          justifyContent='center'
          alignItems='center'
          className='capitalize'
          background={stage?.toUpperCase() === s.toUpperCase() ? gradientBGC : '#E9E9E9'}
          lineHeight='32px'
          color={stage?.toUpperCase() === s.toUpperCase() ? 'white' : '#6B6B6B'}
          fontFamily='Noto Sans'
          fontSize='16px'
          fontStyle='normal'
          fontWeight='500'
          borderWidth={borderWidth}
          borderColor='white'
          borderLeftRadius={idx === 0 ? borderRadiusOutside : '0px'}
          borderRightRadius={idx !== SECTIONS_MAX_IDX ? borderRadiusInner : borderRadiusOutside}
          marginLeft={idx > 0 ? `-${marginLeft}` : 0}
          zIndex={SECTIONS.length - 1 - idx}
          textTransform='capitalize'
        >
          {s.toLowerCase()}
        </Flex>
      ))}
    </Flex>
  )
}

export default ProgressBar
