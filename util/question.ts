// matches ["({TRS3} = 'No')", "({TRS5 = 'yes'})"] in "{TRS3} notempty and !({TRS3} = 'No') and ({TRS5 = 'yes'})"
// const conditionGroups = question.isVisibleIf.match(/\(([^()]+)\)/ig)
// console.log(conditionGroups)
// const hasNotBefore = notBefore.test(question.isVisibleIf)
// console.log('hasNotBefore', hasNotBefore)
// const andBefore = new RegExp(`(?<=and\\s+)!?\\s?\\(${groupWithoutBrackets}\\)`, 'gi')
// const hasAndBefore = andBefore.test(question.isVisibleIf)
// console.log('hasAndBefore', hasAndBefore, andBefore)
// const orBefore = new RegExp(`(?<=or\\s+)!?\\s?\\(${groupWithoutBrackets}\\)`, 'gi')
// const hasOrBefore = orBefore.test(question.isVisibleIf)
// console.log('hasOrBefore', hasOrBefore)

import { DisplayQuestion } from '@/src/types/card'

interface ConditionObj {
  condition: string
  questionId: string
  question: DisplayQuestion
  hasNotBefore: boolean
  hasBracketBefore: boolean
  hasBracketAfter: boolean
  isConditionTrue: boolean
  disabledText: string
}

export const questionEnabler = (questions: DisplayQuestion[]): void => {
  questions.forEach((question, idx, arr) => {
    question.enabled = true
    const conditionObjs: any = []
    if (question.isVisibleIf != null && question.isVisibleIf.length > 0) {
      const andOrRegex = /and|or/gi
      const conditionGroups = question.isVisibleIf.split(andOrRegex)

      if (conditionGroups != null) {
        for (let condition of conditionGroups) {
          const group: Partial<ConditionObj> = {}
          condition = String(condition).trim()
          const hasNotBefore: boolean = condition.startsWith('!')
          const hasBracketBefore: boolean = hasNotBefore ? condition.startsWith('!(') : condition.startsWith('(')
          const hasBracketAfter: boolean = condition.endsWith(')')
          const questionId = (condition.match(/\{([^{}]+)\}/i) ?? [])[1]
          const q = arr.find((q) => q.id === questionId)
          if (q == null) continue
          let disabledText = ''
          let isConditionTrue = false
          if (condition.includes('notempty')) {
            const isNotEmpty = q?.responses?.length != null && q?.responses?.length > 0
            isConditionTrue = hasNotBefore ? !isNotEmpty : isNotEmpty
            disabledText = hasNotBefore ? `${q?.TOCnumber as string} is not empty` : `${q?.TOCnumber as string} is empty`
          } else if (condition.includes('=')) {
            const res = condition.match(/=\s?'(.+)'/i)
            const [_, value] = res ?? []
            const responsesValues = Array.isArray(q?.responses) ? q?.responses.map((r: any) => q.answers[r]) : []
            const includesValue: boolean = responsesValues.includes(value)
            isConditionTrue = hasNotBefore ? !includesValue : includesValue
            disabledText = hasNotBefore ? `${q?.TOCnumber as string} equals '${value}'` : `${q?.TOCnumber as string} does not equals '${value}'`
          }
          group.condition = condition
          group.questionId = questionId
          group.question = q
          group.hasNotBefore = hasNotBefore
          group.hasBracketBefore = hasBracketBefore
          group.hasBracketAfter = hasBracketAfter
          group.isConditionTrue = isConditionTrue
          group.disabledText = disabledText
          conditionObjs.push(group)
        }
        let disabledText = 'Question is disabled because '
        const logicalOperators = question.isVisibleIf.match(andOrRegex) ?? []
        for (let i = 0; i < conditionObjs.length - 1; i++) {
          const conditionObj: ConditionObj = conditionObjs[i]
          const conditionObjNext: ConditionObj = conditionObjs[i + 1]
          const { isConditionTrue } = conditionObj
          const logicalOperator = logicalOperators[i]
          disabledText = `${disabledText}${conditionObj.disabledText}`
          if (logicalOperator === 'and') {
            conditionObjNext.isConditionTrue = conditionObjNext.isConditionTrue && isConditionTrue
            disabledText += ` or ${conditionObjNext.disabledText}`
          } else if (logicalOperator === 'or') {
            conditionObjNext.isConditionTrue = conditionObjNext.isConditionTrue || isConditionTrue
            disabledText += ` or ${conditionObjNext.disabledText}`
          }
          if (i === conditionGroups.length - 2) {
            question.enabled = conditionObjNext.isConditionTrue
            question.enabledCondition = {
              conditionObjs,
              logicalOperators,
              disabledText
            }
          }
        }
      }
    }
  })
}

export const setQuestionCleanTitle = (question: DisplayQuestion): DisplayQuestion => {
  question.cleanTitle = question.title?.replace(/=g(b|e)=/g, '').replace(/=hb=.*=he=/g, '').trim()
  return question
}
