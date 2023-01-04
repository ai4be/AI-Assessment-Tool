import React, { useEffect, useState, useContext } from 'react'
import {
  Avatar,
  Badge,
  Box,
  Button,
  Flex,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  MenuOptionGroup,
  MenuItemOption
} from '@chakra-ui/react'
import { FiFilter } from 'react-icons/fi'
import { useRouter } from 'next/router'
import ProjectContext from '@/src/store/project-context'
import { isEmpty } from '@/util/index'
import { getUserDisplayName } from '@/util/users'
import { CloseIcon } from '@chakra-ui/icons'
import { IoClose } from 'react-icons/io5'

export enum Assignment {
  UNASSIGNED = 'unassigned',
  ASSIGNED = 'assigned',
  ASSIGNED_TO = 'assigned_to'
}

const ASSINGMENT_VALUES = Object.values(Assignment)

export const ASSIGNMENT_LABELS = {
  [Assignment.UNASSIGNED]: 'Unassigned',
  [Assignment.ASSIGNED]: 'Assigned',
  [Assignment.ASSIGNED_TO]: 'Assigned to'
}

export enum DueDate {
  SET = '1',
  NOT_SET = '0'
}

const DUE_DATE_VALUES = Object.values(DueDate)

export const DUE_DATE_LABELS = {
  [DueDate.SET]: 'Set',
  [DueDate.NOT_SET]: 'Not set'
}

let timeoutId: any

export const FilterMenu = (props: any): JSX.Element => {
  const router = useRouter()
  const { users = [] } = useContext(ProjectContext)
  const [includedUserIds, setIncludedUserIds] = useState<string[]>([])
  const [assignment, setAssigment] = useState<Assignment | String>('')
  const [dueDate, setDueDate] = useState<DueDate | String>('')
  const [filterCounter, setFilterCounter] = useState(0)

  // initial load!!!
  useEffect(() => {
    let reroute = false
    const query: any = { ...router.query }
    const assignmentVal = query['filter[assignment]']
    if (assignmentVal != null && !ASSINGMENT_VALUES.includes(assignmentVal)) {
      reroute = true
      delete query['filter[assignment]']
    }
    const dueDateVal = query['filter[due_date]']
    if (dueDateVal != null && !DUE_DATE_VALUES.includes(dueDateVal)) {
      reroute = true
      delete query['filter[due_date]']
    }
    let userIdsVal = query['filter[assigned_to]']
    if (userIdsVal != null && assignmentVal !== Assignment.ASSIGNED_TO) {
      reroute = true
      delete query['filter[assigned_to]']
    }
    if (userIdsVal != null && typeof userIdsVal === 'string') {
      userIdsVal = [userIdsVal]
    }
    if (reroute) {
      void router.replace({
        query
      }, undefined, { shallow: true })
    } else {
      setAssigment(assignmentVal ?? '')
      setDueDate(dueDateVal ?? '')
      setIncludedUserIds(userIdsVal ?? [])
    }
  }, [])

  useEffect(() => {
    const query: any = { ...router.query }
    if (isEmpty(assignment)) {
      delete query['filter[assignment]']
      delete query['filter[assigned_to]']
    } else {
      query['filter[assignment]'] = assignment
      if (assignment === Assignment.ASSIGNED_TO) {
        if (includedUserIds.length > 0) query['filter[assigned_to]'] = includedUserIds
      } else {
        delete query['filter[assigned_to]']
      }
    }
    if (isEmpty(dueDate)) delete query['filter[due_date]']
    else {
      query['filter[due_date]'] = dueDate
    }
    // timeout needed for when we clear all filters, because we then have concurrent state updates
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      void router.push({
        query
      }, undefined, { shallow: true })
      let counter = 0
      if (query['filter[assignment]'] != null) counter++
      if (query['filter[due_date]'] != null) counter++
      setFilterCounter(counter)
    }, 100)
  }, [assignment, dueDate])

  useEffect(() => {
    const query: any = { ...router.query }
    if (assignment === Assignment.ASSIGNED_TO && includedUserIds.length > 0) {
      query['filter[assigned_to]'] = includedUserIds
    } else {
      delete query['filter[assigned_to]']
    }
    void router.push({
      query
    }, undefined, { shallow: true })
  }, [includedUserIds])

  const cleartHandler = (e, val: any, currentVal: any, setter: any): void => {
    e.stopPropagation()
    e.preventDefault()
    if (val === currentVal) setter('')
  }

  const clearAllFilters = (e): void => {
    e.stopPropagation()
    e.preventDefault()
    setAssigment('')
    setDueDate('')
    setIncludedUserIds([])
  }

  return (
    <Menu key='filter-menu' closeOnSelect={false}>
      <MenuButton {...props} as={Button} rightIcon={<FiFilter />} variant='outline' color='var(--main-blue)' size='sm'>
        Filter
        {filterCounter > 0 && <Badge ml='1' size='sm' variant='solid' colorScheme='green' borderRadius='full'>
          {filterCounter}
        </Badge>}
      </MenuButton>
      <MenuList>
        <MenuOptionGroup title='Assignment' type='radio' value={assignment as string} onChange={(val: string) => setAssigment(val)}>
          <MenuItemOption value={Assignment.UNASSIGNED} onClick={(e) => cleartHandler(e, Assignment.UNASSIGNED, assignment, setAssigment)}>
            {ASSIGNMENT_LABELS[Assignment.UNASSIGNED]}
          </MenuItemOption>
          <MenuItemOption value={Assignment.ASSIGNED} onClick={(e) => cleartHandler(e, Assignment.ASSIGNED, assignment, setAssigment)}>
            {ASSIGNMENT_LABELS[Assignment.ASSIGNED]}
          </MenuItemOption>
          <MenuItemOption value={Assignment.ASSIGNED_TO} onClick={(e) => cleartHandler(e, Assignment.ASSIGNED_TO, assignment, setAssigment)}>
            {ASSIGNMENT_LABELS[Assignment.ASSIGNED_TO]}
          </MenuItemOption>
          <MenuOptionGroup type='checkbox' value={includedUserIds} onChange={val => setIncludedUserIds(val as string[])}>
            {users.map(user => (
              <MenuItemOption key={user._id} value={String(user._id)} pl='6' isDisabled={assignment !== Assignment.ASSIGNED_TO}>
                <Flex justifyContent='flex-start' alignItems='center'>
                  <Avatar size='xs' name={getUserDisplayName(user)} src={user.xsAvatar} mr='1' />
                  <Box>{getUserDisplayName(user)}</Box>
                </Flex>
              </MenuItemOption>
            ))}
          </MenuOptionGroup>
        </MenuOptionGroup>
        <MenuDivider />
        <MenuOptionGroup title='Due Date' type='radio' value={dueDate as string} onChange={(val: string) => setDueDate(val)}>
          <MenuItemOption value={DueDate.SET} onClick={(e) => cleartHandler(e, DueDate.SET, dueDate, setDueDate)}>
            {DUE_DATE_LABELS[DueDate.SET]}
          </MenuItemOption>
          <MenuItemOption value={DueDate.NOT_SET} onClick={(e) => cleartHandler(e, DueDate.NOT_SET, dueDate, setDueDate)}>
            {DUE_DATE_LABELS[DueDate.NOT_SET]}
          </MenuItemOption>
        </MenuOptionGroup>
        <MenuDivider />
        <MenuItem icon={<CloseIcon />} onClick={clearAllFilters} isDisabled={isEmpty(dueDate) && isEmpty(assignment)}>
          Clear All Filters
        </MenuItem>
      </MenuList>
    </Menu>
  )
}
