import React, { useEffect, useState, useRef } from 'react'
import {
  Button,
  Flex,
  Text,
  Textarea,
  Box,
  RadioGroup,
  Radio,
  Stack,
  CheckboxGroup,
  Checkbox,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverBody,
  BoxProps,
  RadioGroupProps,
  CheckboxGroupProps
} from '@chakra-ui/react'
import { isEmpty } from '@/util/index'
import { GiCancel } from 'react-icons/gi'
import { AiOutlineQuestionCircle } from 'react-icons/ai'
import { Question, DisplayQuestion, QuestionType } from '@/src/types/card'
import { useRouter } from 'next/router'
import { StringOrNumber } from '@chakra-ui/utils'
import { useTranslation } from 'next-i18next'

export const QuestionHelp = ({ question }: { question: Question }): JSX.Element => {
  const [help, setHelp] = useState('')

  useEffect(() => {
    if (question.title != null) {
      const match = question.title.match(/=hb=(.*)=he=/)
      if (match?.[1] != null) {
        const h = match[1].replace(/=br=/g, '<br />').trim()
        setHelp(h)
      }
    }
  }
  , [question.title])

  return (
    <>
      {!isEmpty(help) &&
        <Popover>
          <PopoverTrigger>
            <AiOutlineQuestionCircle cursor='pointer' display='inline-block' style={{ display: 'inline-block' }} />
          </PopoverTrigger>
          <PopoverContent opacity='1'>
            <PopoverArrow />
            <PopoverCloseButton />
            <PopoverBody opacity={1} dangerouslySetInnerHTML={{ __html: help }} color='var(--chakra-colors-gray-800)' fontWeight='light' />
          </PopoverContent>
        </Popover>}
    </>
  )
}

type QuestionAnswerProps = BoxProps & {
  question: DisplayQuestion
  onChange?: Function
} & (RadioGroupProps | CheckboxGroupProps)

export const QuestionAnswers = ({ question, onChange, ...boxProps }: QuestionAnswerProps): JSX.Element => {
  const [value, setValue] = React.useState<any>(question.responses ?? '')
  const valueHandler = (value: any): void => {
    if (!Array.isArray(value)) value = [value]
    if (Array.isArray(value) && value.length > 1) {
      value = value.filter(v => v !== '')
      value = Array.from(new Set<any>(value))
    }
    setValue(value)
    if (onChange != null) onChange(value)
  }
  if (question.type === QuestionType.RADIO) {
    const radioGroupProps = boxProps as RadioGroupProps
    return (
      <RadioGroup {...radioGroupProps} onChange={valueHandler} value={value[0]} name={question.id}>
        <Stack direction='row'>
          {question?.answers?.map((a, idx) => (
            <Radio
              key={idx} value={`${String(idx)}`} disabled={question.enabled !== true} size='sm' fontSize='sm'
              opacity={question.enabled === true ? 1 : 0.5}
            >
              <Box display='inline' color='var(--text-grey)'>{a?.replace(/=g(b|e)=/g, '').replace(/=hb=.*=he=/g, '')}</Box>
            </Radio>
          ))}
        </Stack>
      </RadioGroup>
    )
  } else if (question.type === QuestionType.CHECKBOX) {
    const checkoxGroupProps = boxProps as CheckboxGroupProps
    const valueCheck: StringOrNumber[] = (Array.isArray(value) ? value : [value]) as StringOrNumber[]
    return (
      <CheckboxGroup {...checkoxGroupProps} onChange={valueHandler} value={valueCheck}>
        <Stack direction='row'>
          {question?.answers?.map((a, idx) => (
            <Checkbox
              size='sm' key={idx} value={`${idx}`} disabled={question.enabled !== true} fontSize='sm'
              opacity={question.enabled === true ? 1 : 0.5}
            >
              <Box display='inline' color='var(--text-grey)'>{a?.replace(/=g(b|e)=/g, '').replace(/=hb=.*=he=/g, '')}</Box>
            </Checkbox>
          ))}
        </Stack>
      </CheckboxGroup>
    )
  }
  return <></>
}

export const QuestionComp = ({ question, onChange, ...rest }: { question: DisplayQuestion, onChange: Function, [key: string]: any }): JSX.Element => {
  const { t } = useTranslation()
  const router = useRouter()
  const { question: questionId } = router.query
  const element = useRef<HTMLDivElement>(null)
  const [conclusion, setConclusion] = useState(question.conclusion ?? '')
  const [showEditOptions, setShowEditOptions] = useState(false)

  useEffect(() => {
    if (element?.current != null && questionId != null && questionId === question.id) {
      setTimeout(() => element.current?.scrollIntoView({ behavior: 'smooth' }), 400)
    }
  }, [questionId, element?.current])

  const saveHandler = async (): Promise<void> => {
    await onChange(question, null, conclusion.trim())
    setShowEditOptions(false)
  }
  const cancelHandler = (): void => {
    setConclusion(question.conclusion ?? '')
    setShowEditOptions(false)
  }

  return (
    <>
      <Text color='var(--main-blue)' fontSize='sm' as='b' display='block' opacity={question.enabled === true ? 1 : 0.5} ref={element}>
        {`${question.TOCnumber as string} ${question.title?.replace(/=g(b|e)=/g, '').replace(/=hb=.*=he=/g, '')}`}
        <QuestionHelp question={question} />
      </Text>
      {question.enabled === false &&
        <Text color='var(--main-blue)' fontSize='xs' as='b' textDecoration='underline' display='block'>
          {question.enabledCondition?.disabledText}
        </Text>}
      <Box ml='1.5'>
        <QuestionAnswers question={question} onChange={(value: any) => onChange(question, value)} marginY='1rem' />
        <Text color='var(--main-blue)' fontSize='sm' as='b' display='block' opacity={question.enabled === true ? 1 : 0.5}>
          Justification
        </Text>
        <Textarea
          disabled={question.enabled !== true}
          placeholder={`${t('placeholders:motivate-answer')}`}
          size='sm'
          style={{ resize: 'none' }}
          value={conclusion}
          onChange={(e) => setConclusion(e.target.value)}
          onFocus={() => setShowEditOptions(true)}
          onBlur={() => setTimeout(() => setShowEditOptions(false), 500)} // needed otherwise the save button will not be clickable
        />
        {showEditOptions &&
          <Flex alignItems='center' justifyContent='space-between' mt='1'>
            <Flex alignItems='center'>
              <Button size='sm' colorScheme='blue' disabled={conclusion.trim() === question?.conclusion} onClick={() => { void saveHandler() }}>
                {t('buttons:save')}
              </Button>
              <GiCancel size='20px' color='#286cc3' cursor='pointer' className='ml-1' onClick={cancelHandler} />
            </Flex>
          </Flex>}
      </Box>
    </>
  )
}

export default QuestionComp
