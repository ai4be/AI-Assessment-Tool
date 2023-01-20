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

export const questionEnabler = (questions: any[]) => {
  questions.forEach((question, idx, arr) => {
    question.enabled = true
    const conditionObjs: any = []
    if (question.isVisibleIf != null && question.isVisibleIf.length > 0) {
      const andOrRegex = /and|or/gi
      const conditionGroups = question.isVisibleIf.split(andOrRegex)

      if (conditionGroups != null) {
        for (let condition of conditionGroups) {
          const group: any = {}
          condition = String(condition).trim() as String
          const hasNotBefore: boolean = condition.startsWith('!')
          const hasBracketBefore: boolean = hasNotBefore ? condition.startsWith('!(') : condition.startsWith('(')
          const hasBracketAfter: boolean = condition.endsWith(')')
          const questionId = (condition.match(/\{([^{}]+)\}/i) ?? [])[1]
          const q = arr.find((q) => q.id === questionId)
          if (q == null) continue
          let disabledText = ''
          let isConditionTrue = false
          if (condition.includes('notempty') === true) {
            const isNotEmpty = q?.responses?.length > 0
            isConditionTrue = hasNotBefore ? !isNotEmpty : isNotEmpty
            disabledText = hasNotBefore ? `${q?.TOCnumber} is not empty` : `${q?.TOCnumber} is empty`
          } else if (condition.includes('=') === true) {
            const [_, value] = condition.match(/=\s?'(.+)'/i)
            const responsesValues = Array.isArray(q?.responses) ? q?.responses.map((r: any) => q.answers[r]) : []
            const includesValue: boolean = responsesValues.includes(value)
            isConditionTrue = hasNotBefore ? !includesValue : includesValue
            disabledText = hasNotBefore ? `${q?.TOCnumber} equals '${value}'` : `${q?.TOCnumber} does not equals '${value}'`
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
        const logicalOperators = question.isVisibleIf.match(andOrRegex)
        for (let i = 0; i < conditionObjs.length - 1; i++) {
          const conditionObj = conditionObjs[i]
          const conditionObjNext = conditionObjs[i + 1]
          const { isConditionTrue } = conditionObj
          const logicalOperator = logicalOperators[i]
          disabledText += conditionObj.disabledText
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
