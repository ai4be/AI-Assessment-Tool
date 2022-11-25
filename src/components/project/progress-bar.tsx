import React, { FC } from 'react'
import { Flex } from '@chakra-ui/react'

const SECTIONS: string[] = ['preparation', 'execution', 'utilisation', 'checklist']
const SECTIONS_MAX_IDX = SECTIONS.length - 1

const borderWidth = '5px'
const borderRadiusOutside = '10px'
const borderRadiusInner = '50px'
const marginLeft = '10px'

const gradientBGC = 'linear-gradient(89.87deg, #182FFF 7.28%, rgba(234, 226, 253, 0) 158.64%)'

const ProgressBar: FC<any> = (): JSX.Element => {
  return (
    <Flex width='100%' justifyContent='center' alignItems='center' backgroundColor='white'>
      {SECTIONS.map((s, idx) => (
        <Flex
          key={s + String(idx)}
          width={idx > 0 ? `calc(25% + ${marginLeft})` : '25%'}
          height='38px'
          justifyContent='center'
          alignItems='center'
          className='capitalize'
          background={idx === 0 ? gradientBGC : '#E9E9E9'}
          lineHeight='32px'
          color={idx === 0 ? 'white' : '#6B6B6B'}
          fontFamily='Noto Sans'
          fontSize='16px'
          fontStyle='normal'
          fontWeight='500'
          borderWidth={borderWidth}
          borderColor='white'
          borderLeftRadius={idx === 0 ? borderRadiusOutside : '0px'}
          borderRightRadius={idx !== SECTIONS_MAX_IDX ? borderRadiusInner : borderRadiusOutside}
          marginLeft={idx > 0 ? `-${marginLeft}` : 0}
          zIndex={10 - idx}
        >
          {s}
        </Flex>
      ))}
    </Flex>
  )
}

export default ProgressBar
