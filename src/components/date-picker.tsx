// https://codesandbox.io/s/chakra-ui-datepicker-demo-qmx3c?file=/src/components/Datepicker/Datepicker.tsx:1342-1461
import React, { useRef, useState, ReactNode, useEffect } from 'react'
import lodash_isEmpty from 'lodash/isEmpty'
import lodash_isNil from 'lodash/isNil'
import {
  Box,
  Button,
  Divider,
  Heading,
  HStack,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  SimpleGrid,
  Text,
  useOutsideClick,
  VStack,
  InputGroup,
  Input as InputComponent,
  InputRightElement
} from '@chakra-ui/react'
import { CalendarIcon } from '@chakra-ui/icons'
import {
  DateObj,
  useDayzed,
  RenderProps,
  GetBackForwardPropsOptions,
  Calendar
} from 'dayzed'
import { format } from 'date-fns'
import { FiEdit2 } from 'react-icons/fi'

const MONTH_NAMES_DEFAULT = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec'
]
const DAY_NAMES_DEFAULT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const DATE_FORMAT_DEFAULT = 'dd MMM yyyy'

interface SingleDatepickerBackButtonsProps {
  calendars: Calendar[]
  getBackProps: (data: GetBackForwardPropsOptions) => Record<string, any>
}

interface SingleDatepickerForwardButtonsProps {
  calendars: Calendar[]
  getForwardProps: (data: GetBackForwardPropsOptions) => Record<string, any>
}

export interface SingleDatepickerProps {
  disabled?: boolean
  onDateChange: (date: Date) => void
  id?: string
  name?: string
  date: Date
  configs?: SingleDatepickerConfigs
}

export interface SingleDatepickerConfigs {
  dateFormat: string
  monthNames: string[]
  dayNames: string[]
}

const SingleDatepickerBackButtons = (props: SingleDatepickerBackButtonsProps): JSX.Element => {
  const { calendars, getBackProps } = props
  return (
    <>
      <Button
        {...getBackProps({
          calendars,
          offset: 12
        })}
        variant='ghost'
        size='sm'
      >
        {'<<'}
      </Button>
      <Button {...getBackProps({ calendars })} variant='ghost' size='sm'>
        {'<'}
      </Button>
    </>
  )
}

const SingleDatepickerForwardButtons = (
  props: SingleDatepickerForwardButtonsProps
): JSX.Element => {
  const { calendars, getForwardProps } = props
  return (
    <>
      <Button {...getForwardProps({ calendars })} variant='ghost' size='sm'>
        {'>'}
      </Button>
      <Button
        {...getForwardProps({
          calendars,
          offset: 12
        })}
        variant='ghost'
        size='sm'
      >
        {'>>'}
      </Button>
    </>
  )
}

const SingleDatepickerCalendar = (
  props: RenderProps & { configs: SingleDatepickerConfigs }
): JSX.Element => {
  const {
    calendars,
    getDateProps,
    getBackProps,
    getForwardProps,
    configs
  } = props

  if (lodash_isEmpty(calendars)) {
    return (<></>)
  }

  return (
    <HStack className='datepicker-calendar'>
      {calendars.map((calendar) => (
        <VStack key={`${calendar.month}${calendar.year}`}>
          <HStack>
            <SingleDatepickerBackButtons
              calendars={calendars}
              getBackProps={getBackProps}
            />
            <Heading size='sm' textAlign='center'>
              {configs.monthNames[calendar.month]} {calendar.year}
            </Heading>
            <SingleDatepickerForwardButtons
              calendars={calendars}
              getForwardProps={getForwardProps}
            />
          </HStack>
          <Divider />
          <SimpleGrid columns={7} spacing={1} textAlign='center'>
            {configs.dayNames.map(day => (
              <Box key={`${calendar.month}${calendar.year}${day}`}>
                <Text fontSize='sm' fontWeight='semibold'>
                  {day}
                </Text>
              </Box>
            ))}
            {calendar.weeks.map((week, weekIndex) => {
              return week.map((dateObj: DateObj, index) => {
                const {
                  date,
                  today,
                  // prevMonth,
                  // nextMonth,
                  selected
                } = dateObj
                const key = `${calendar.month}${calendar.year}${weekIndex}${index}`

                return (
                  <Button
                    {...getDateProps({
                      dateObj
                      // disabled: isDisabled
                    })}
                    key={key}
                    size='sm'
                    variant='outline'
                    borderColor={today ? 'purple.400' : 'transparent'}
                    bg={selected ? 'purple.200' : undefined}
                  >
                    {date.getDate()}
                  </Button>
                )
              })
            })}
          </SimpleGrid>
        </VStack>
      )
      )}
    </HStack>
  )
}

export const SingleDatepicker: React.FC<SingleDatepickerProps> = ({
  configs = {
    dateFormat: DATE_FORMAT_DEFAULT,
    monthNames: MONTH_NAMES_DEFAULT,
    dayNames: DAY_NAMES_DEFAULT
  },
  ...props
}): JSX.Element => {
  let { date, name, disabled, onDateChange, id } = props

  const ref = useRef<HTMLElement>(null)
  const initialFocusRef = useRef<HTMLInputElement>(null)
  const [popoverOpen, setPopoverOpen] = useState(false)
  const [processClickEvent, setProcessClickEvent] = useState(true)

  const closeHandler = (e: any) => {
    if (e?.preventDefault != null) {
      e.preventDefault()
      e.stopPropagation()
    }
    if (popoverOpen) {
      setPopoverOpen(false)
      setTimeout(() => setProcessClickEvent(true), 300)
    }
  }

  useOutsideClick({
    ref,
    handler: closeHandler
  })

  const openpopover = (): void => {
    // because useOutsideClick is faster when it's open
    if (!processClickEvent) return
    setPopoverOpen(true)
  }

  const onDateSelected = (options: { selectable: boolean, date: Date }): void => {
    const { selectable, date } = options
    if (!selectable) return
    if (!lodash_isNil(date)) {
      onDateChange(date)
      closeHandler(null)
    }
  }

  const dayzedData = useDayzed({
    showOutsideDays: true,
    onDateSelected,
    selected: date
  })

  return (
    <Popover
      placement='bottom'
      variant='responsive'
      isOpen={popoverOpen}
      onOpen={() => setProcessClickEvent(false)}
      onClose={closeHandler}
      initialFocusRef={initialFocusRef}
      isLazy
    >
      <PopoverTrigger>
        {/* <Text
          id={id}
          fontSize='sm'
          fontWeight='600'
          ref={initialFocusRef}
          onClick={() => setPopoverOpen(!popoverOpen)}
          name={name}
          value={date != null ? format(date, configs.dateFormat) : ''}
          onChange={(e) => e.target.value}
        >
          {date != null ? format(date, configs.dateFormat) : ''}
        </Text> */}
        <Box cursor='pointer' onClick={() => popoverOpen ? null : openpopover()} popoverOpen={popoverOpen}>
          {props.children}
        </Box>
      </PopoverTrigger>
      <PopoverContent ref={ref}>
        <PopoverBody
          padding='10px 5px'
          borderWidth='1'
          borderColor='blue.400'
        >
          <SingleDatepickerCalendar {...dayzedData} configs={configs} />
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
}
