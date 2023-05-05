import React, { useEffect, useState, useRef, useContext } from 'react'
import {
  Avatar,
  Box,
  Button,
  Flex,
  Text
} from '@chakra-ui/react'
import Link from 'next/link'
import { DisplayActivity, ActivityType } from '@/src/types/activity'
import style from '@/src/components/activity/index.module.css'
import { format } from 'date-fns'
import { getUserDisplayName } from '@/util/users'
import { isEmpty } from '@/util/index'
import { QuestionType } from '@/src/types/card'
import { useOnScreen } from '@/src/hooks/index'
import UserContext from '@/src/store/user-context'
import { defaultFetchOptions, HTTP_METHODS } from '@/util/api'
import { User } from '@/src/types/user'

const formatDate = (date: string | Date): string => {
  const d = new Date(date)
  const currentDate = new Date()
  const skipYear = d.getFullYear() === currentDate.getFullYear()
  const skipMonth = d.getMonth() === currentDate.getMonth() && d.getDate() === currentDate.getDate()
  let formatExpression = 'H:mm'
  if (skipMonth) return format(d, formatExpression)
  formatExpression += ' d MMM'
  if (skipYear) return format(d, formatExpression)
  formatExpression += ' yyyy'
  return format(d, formatExpression)
}

// const queryObjToQueryString = (query: any): string => {
//   return Object.keys(query).map(k => {
//     if (typeof query[k] === 'object') {
//       return Object.keys(query[k]).map(kk => `${k}[${kk}]=${String(query[k][kk])}`).join('&')
//     }
//     return `${k}=${String(query[k])}`
//   }).join('&')
// }

export const ActivityTimeline = ({ activities = [], total, loadMoreFn }: { activities: DisplayActivity[], total: number, loadMoreFn?: Function }): JSX.Element => {
  return (
    <Box className={style.timeline}>
      {activities.map((activity: DisplayActivity, idx: number) =>
        <TimelineItem key={activity._id} activity={activity} placement={idx % 2 === 0 ? 'left' : 'right'} />)}
      {loadMoreFn != null && total !== activities?.length &&
        <Flex justifyContent='center' position='relative' zIndex='1'>
          <Button onClick={() => loadMoreFn()}>Load more</Button>
        </Flex>}
    </Box>
  )
}

export const TimelineItem = ({ activity, placement }: { activity: DisplayActivity, placement: string }): JSX.Element => {
  const ref = useRef<HTMLDivElement>(null)
  const [promise, setPromise] = useState<null | Promise<any>>(null)
  const [setSeenBy, setSetSeenBy] = useState<boolean>(false)
  const isVisible = useOnScreen(ref)
  const { user } = useContext(UserContext)
  const userId = user?._id
  const isCreator = activity.createdBy === userId
  activity.seenBy = activity.seenBy ?? []
  const isSeen = activity.seenBy.includes(userId) || isCreator

  useEffect(() => {
    if (isVisible && !isSeen && !isCreator && promise == null && !setSeenBy) {
      const url = `/api/activities/${activity._id}/seen`
      const p = fetch(url, {
        ...defaultFetchOptions,
        method: HTTP_METHODS.POST,
        body: JSON.stringify({})
      })
      setPromise(p)
      void p.then(response => {
        if (response.ok) setSetSeenBy(true)
      }).finally(() => setPromise(null))
    }
  }, [isVisible, isSeen, isCreator, promise, setSeenBy])

  return (
    <Box className={`${style.container} ${placement === 'left' ? style.left : style.right} ${isSeen ? '' : style.unSeen}`} ref={ref}>
      <Box className={style.content}>
        <Flex alignItems='center'>
          <Avatar size='xs' name={getUserDisplayName(activity.creator)} src={activity.creator.xsAvatar} />
          <Text ml='1' as='b' fontSize='sm'>{getUserDisplayName(activity.creator)}</Text>
        </Flex>
        &nbsp;
        {activityRenderer(activity)}
      </Box>
      <Box className={style.date}>{formatDate(activity.createdAt)}</Box>
    </Box>
  )
}

const getProjectLinkComp = (displayActivity: DisplayActivity, content: any, cardId?: string, questionId?: string, commentId?: string): JSX.Element => {
  if (displayActivity.project != null) {
    const query: any = {}
    if (cardId != null) query.card = cardId
    if (questionId != null) query.question = questionId
    if (commentId != null) query.comment = commentId
    const linkProps = {
      pathname: `/projects/${displayActivity.project._id}`,
      query
    }
    return (
      <Link href={linkProps} shallow legacyBehavior>
        <a>{content}</a>
      </Link>
    )
  }
  return (<>{content}</>)
}

function activityRenderer (displayActivity: DisplayActivity, currentUser?: User): JSX.Element {
  const { question } = displayActivity
  switch (displayActivity.type) {
    case ActivityType.PROJECT_CREATE: {
      const text = `created project ${displayActivity.data?.name ?? ''}`
      return getProjectLinkComp(displayActivity, text)
    }
    case ActivityType.PROJECT_UPDATE: {
      const isIndustryUpdate = displayActivity.data?.industry !== undefined
      const isNameUpdate = displayActivity.data?.name !== undefined
      const isDescriptionUpdate = displayActivity.data?.description !== undefined
      let text = ''
      if (isNameUpdate) text += `updated project name to ${displayActivity.data?.name ?? ''}`
      if (isIndustryUpdate) text += ` updated project industry to ${displayActivity.data?.name ?? ''}`
      if (isDescriptionUpdate) text += ' updated project description'
      text.trim()
      return getProjectLinkComp(displayActivity, text)
    }
    case ActivityType.PROJECT_DELETE: {
      return getProjectLinkComp(displayActivity, `deleted project ${displayActivity.data?.name ?? ''}`)
    }
    case ActivityType.PROJECT_USER_ADD: {
      const text = `added user to project ${displayActivity.data?.name ?? ''}`.trim()
      return getProjectLinkComp(displayActivity, text)
    }
    case ActivityType.PROJECT_USER_REMOVE: {
      const text = `removed user of project ${displayActivity.data?.name ?? ''}`.trim()
      return getProjectLinkComp(displayActivity, text)
    }
    case ActivityType.PROJECT_UPDATE_DESCRIPTION: {
      const text = 'updated project description'
      return getProjectLinkComp(displayActivity, text)
    }
    case ActivityType.PROJECT_UPDATE_INDUSTRY: {
      const text = `updated project industry to ${displayActivity.data?.industry ?? ''}`
      return getProjectLinkComp(displayActivity, text)
    }
    case ActivityType.PROJECT_UPDATE_NAME: {
      const text = `updated project name to ${displayActivity.data?.name ?? ''}`
      return getProjectLinkComp(displayActivity, text)
    }
    case ActivityType.CARD_COLUMN_UPDATE: {
      const text = `moved card to column "${displayActivity.data?.columnName ?? ''}"`
      return getProjectLinkComp(displayActivity, text, displayActivity.cardId)
    }
    case ActivityType.CARD_DUE_DATE_ADD: {
      const text = `added due date to card: "${format(displayActivity.data?.dueDate, 'd MMM yyyy')}"`
      return getProjectLinkComp(displayActivity, text, displayActivity.cardId)
    }
    case ActivityType.CARD_DUE_DATE_UPDATE: {
      const text = `updated due date of card: "${format(displayActivity.data?.dueDate, 'd MMM yyyy')}"`
      return getProjectLinkComp(displayActivity, text, displayActivity.cardId)
    }
    case ActivityType.CARD_DUE_DATE_DELETE: {
      const text = 'deleted due date of card'
      return getProjectLinkComp(displayActivity, text, displayActivity.cardId)
    }
    case ActivityType.CARD_USER_ADD: {
      const [user] = displayActivity.users ?? []
      let text: any = `assigned card to "${displayActivity.data?.name ?? ''}"`
      if (user != null) text = (<>assigned card of {getUserDisplayName(user)}</>)
      return getProjectLinkComp(displayActivity, text, displayActivity.cardId)
    }
    case ActivityType.CARD_USER_REMOVE: {
      const [user] = displayActivity.users ?? []
      let text: any = `unassigned card of "${displayActivity.data?.name ?? ''}"`
      if (user != null) text = (<>unassigned card of {getUserDisplayName(user)}</>)
      return getProjectLinkComp(displayActivity, text, displayActivity.cardId)
    }
    case ActivityType.CARD_STAGE_UPDATE: {
      const text: any = (
        <>
          <Text display='inline'>change card stage to </Text>
          <Text display='inline' textTransform='capitalize'>"{displayActivity.data?.stage?.toLowerCase()}"</Text>
        </>
      )
      return getProjectLinkComp(displayActivity, text, displayActivity.cardId)
    }
    case ActivityType.COMMENT_CREATE: {
      const { comment } = displayActivity
      if (question != null) { // means the project is deleted
        const text: any = <Text noOfLines={1} display='inline'>commented on question "{question.TOCnumber}"`</Text>
        return getProjectLinkComp(displayActivity, text, displayActivity.cardId, undefined, comment != null ? displayActivity.commentId : undefined)
      }
      const text: any = (<Text display='inline'>commented on card</Text>)
      return getProjectLinkComp(displayActivity, text, displayActivity.cardId)
    }
    case ActivityType.COMMENT_CREATE_AND_MENTION: {
      const { comment, users = [] } = displayActivity
      let text = 'commented and mentioned'
      if (!isEmpty(users)) {
        for (const user of users) {
          text += ` ${getUserDisplayName(user)}`
        }
      }
      text += ' on question'
      if (question != null) {
        text += ` "${question.TOCnumber ?? ''}"`
      }
      return getProjectLinkComp(displayActivity, text, displayActivity.cardId, undefined, comment != null ? displayActivity.commentId : undefined)
    }
    case ActivityType.COMMENT_UPDATE:
    case ActivityType.COMMENT_UPDATE_AND_MENTION: {
      const { comment, users = [] } = displayActivity
      let text: string | JSX.Element = 'updated comment with mentions'
      if (!isEmpty(users)) {
        text = `${text} of`
        for (const user of users) {
          text = `${text} ${getUserDisplayName(user)}`
        }
      }
      text = `${text} on question`
      if (question != null) {
        text = (<Text display='inline'>{text} {question.TOCnumber} </Text>)
      }
      return getProjectLinkComp(displayActivity, text, displayActivity.cardId, undefined, comment != null ? displayActivity.commentId : undefined)
    }
    case ActivityType.COMMENT_DELETE: {
      let text: any = 'deleted comment on question'
      if (question != null) {
        text = (<Text display='inline'>{text} {question.TOCnumber}</Text>)
      }
      return getProjectLinkComp(displayActivity, text, displayActivity.cardId, displayActivity.questionId)
    }
    case ActivityType.QUESTION_CONCLUSION_UPDATE: {
      const { data } = displayActivity
      let text: any = 'updated conclusion of question'
      if (question != null) {
        text = (<Text display='inline'>{text} {question.TOCnumber}</Text>)
      }
      if (data?.conclusion != null) {
        text = (<>{text}: "<Text display='inline' noOfLines={1} fontSize='xs' style={{ display: 'inline' }}>{data.conclusion}</Text>"</>)
      }
      return getProjectLinkComp(displayActivity, text, displayActivity.cardId, displayActivity.questionId)
    }
    case ActivityType.QUESTION_RESPONSE_UPDATE: {
      const { question, data } = displayActivity
      let text: any = 'updated response of question'
      if (question != null) {
        text = (<Text display='inline'>{text} {question.TOCnumber}</Text>)
      }
      if (data?.responses != null && question?.answers != null) {
        if (question.type === QuestionType.CHECKBOX || question.type === QuestionType.RADIO) {
          const values = data?.responses.map((r: number) => question.answers[r])
          text = <>{text}: "<Text display='inline' fontSize='xs'>{values.join(',')}</Text>"</>
        } else {
          text = <>{text}: "<Text display='inline' fontSize='xs'>{data?.responses}</Text>"</>
        }
      }
      return getProjectLinkComp(displayActivity, text, displayActivity.cardId, displayActivity.questionId)
    }
    case ActivityType.ROLE_CREATE: {
      const { data } = displayActivity
      let text: any = 'created role'
      if (data?.name != null) {
        text = <Text display='inline'>{text}: "{data.name}"</Text>
      }
      return getProjectLinkComp(displayActivity, text)
    }
    case ActivityType.ROLE_DELETE: {
      const { data } = displayActivity
      let text: any = 'deleted role'
      if (data?.name != null) {
        text = <Text display='inline'>{text}: "{data.name}"</Text>
      }
      return getProjectLinkComp(displayActivity, text)
    }
    case ActivityType.ROLE_UPDATE: {
      const { data } = displayActivity
      let text: any = 'updated role'
      if (data?.name != null) {
        text = <Text display='inline'>{text}: "{data.name}"</Text>
      }
      return getProjectLinkComp(displayActivity, text)
    }
    case ActivityType.ROLE_USER_ADD: {
      const { users, role } = displayActivity
      const [user] = users ?? []
      let text = 'added user to role'
      if (role?.name != null) {
        text = `${text} "${role.name}":`
      }
      if (user != null) {
        text = `${text} "${getUserDisplayName(user)}"`
      }
      return getProjectLinkComp(displayActivity, text)
    }
    case ActivityType.ROLE_USER_REMOVE: {
      const { users, role } = displayActivity
      const [user] = users ?? []
      let text = 'removed user of role'
      if (role?.name != null) {
        text = `${text} "${role.name}":`
      }
      if (user != null) {
        text = `${text} "${getUserDisplayName(user)}"`
      }
      return getProjectLinkComp(displayActivity, text)
    }
  }
  return (<></>)
}
