import React, { FC } from 'react'
import { NextRouter, useRouter } from 'next/router'
import { Flex } from '@chakra-ui/react'
import { STAGE_VALUES } from '@/src/types/card'
import { QueryFilterKeys } from '@/src/components/project/project-bar/filter-menu'

const borderWidth = '5px'
const borderRadiusOutside = '10px'
const borderRadiusInner = '50px'
const marginLeft = '10px'

const gradientBGC = 'linear-gradient(89.87deg, #182FFF 7.28%, rgba(234, 226, 253, 0) 158.64%)'

const SECTION_ALL: string = 'all'

export const SECTION_CHECKLIST: string = 'checklist'

function stageClickHandler (router: NextRouter, stage: string | null): void {
  const query: any = { ...router.query, [QueryFilterKeys.STAGE]: stage }
  if (stage == null) delete query[QueryFilterKeys.STAGE] // eslint-disable-line @typescript-eslint/no-dynamic-delete
  void router.push({
    query
  }, undefined, { shallow: true })
}

const ProgressBar: FC<any> = (): JSX.Element => {
  const router = useRouter()
  const { [QueryFilterKeys.STAGE]: stage = null } = router.query ?? {}
  const SECTIONS: string[] = [SECTION_ALL, ...STAGE_VALUES, SECTION_CHECKLIST]
  const SECTIONS_MAX_IDX = SECTIONS.length - 1

  return (
    <Flex width='100%' justifyContent='center' alignItems='center' backgroundColor='white' className='print:hidden'>
      {SECTIONS.map((s, idx) => (
        <Flex
          onClick={(): void => stageClickHandler(router, s === SECTION_ALL ? null : s.toUpperCase())}
          cursor='pointer'
          key={s + String(idx)}
          width={idx > 0 ? `calc(${100 / SECTIONS.length}% + ${marginLeft})` : `${100 / SECTIONS.length}%`}
          height='38px'
          justifyContent='center'
          alignItems='center'
          className='capitalize'
          background={String(stage).toUpperCase() === s.toUpperCase() || (stage == null && s === SECTION_ALL) ? gradientBGC : '#E9E9E9'}
          lineHeight='32px'
          color={String(stage).toUpperCase() === s.toUpperCase() || (stage == null && s === SECTION_ALL) ? 'white' : '#6B6B6B'}
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
