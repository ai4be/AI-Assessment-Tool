import type { NextApiRequest, NextApiResponse } from 'next'
import { isConnected, getUserFromRequest } from '@/util/temp-middleware'
import { getUserProjects } from '@/src/models/project'
import Activity from '@/src/models/activity'
import { isEmpty } from '@/util/index'
import { toObjectId } from '@/src/models/mongodb'

const propsToWhere = (prop: string, value: any): any => {
  if (value === `${+value}` && +value === 1) return { $and: [{ [prop]: { $exists: true } }, { [prop]: { $ne: null } }, { [prop]: { $ne: '' } }] }
  if (value === `${+value}` && +value === 0) return { $or: [{ [prop]: { $exists: false } }, { [prop]: { $eq: null } }, { [prop]: { $eq: '' } }] }
  return {}
}

async function handler (req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const user = getUserFromRequest(req)
  let {
    limit = 100,
    page,
    'filter[projectId]': projectIds,
    'filter[cardId]': cardIds,
    'filter[questionId]': questionIds,
    'filter[card]': card,
    'filter[question]': question,
    'filter[role]': role
  } = req.query
  limit = parseInt(limit as string)
  limit = Math.min(limit, 500) // don't allow more then 500 results
  page = page != null ? String(page) : undefined
  projectIds = projectIds != null ? String(projectIds).split(',') : []
  cardIds = cardIds != null ? String(cardIds).split(',') : []
  questionIds = questionIds != null ? String(questionIds).split(',') : []

  const whereFilterByType = {
    card,
    question,
    role
  }
  let where: any = {}
  where = Object
    .keys(whereFilterByType)
    .map(k => propsToWhere(k, whereFilterByType[k]))
    .reduce((a, b) => ({ ...a, ...b }), where)

  switch (req.method) {
    case 'GET': {
      let projects = await getUserProjects(user?._id)
      if (isEmpty(projects)) return res.status(200).send([])
      if (!isEmpty(projectIds)) projects = projects.filter((p) => projectIds?.includes(String(p._id)))
      where = { ...where, projectId: { $in: projects.map((p) => p._id) } }
      if (!isEmpty(cardIds)) where.cardId = { $in: cardIds.map((c) => toObjectId(c)) }
      if (!isEmpty(questionIds)) where.questionId = { $in: questionIds }

      const result = await Activity.find(where, limit, ['_id', -1], page)
      if (result == null) return res.status(200).send([])
      const returnData = {
        data: result.data,
        total: result.count,
        page: result.page,
        limit: result.limit
      }
      return res.status(200).send(returnData)
    }
    default:
      return res.status(400).send({ message: 'Invalid request' })
  }
}

export default isConnected(handler)
