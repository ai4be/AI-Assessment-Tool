import { ObjectId } from 'mongodb'
import { toObjectId } from './mongodb'
import { Activity as ActivityTypeDef, ActivityData, ActivityType, ActivityVisibility } from '@/src/types/activity'
import { isEmpty } from '@/util/index'
import { CardStage } from '@/src/types/cards'
import Model from './model'
import { Comment as CommentType } from '../types/comment'
import { Comment } from './comment'
import { getCard } from './card'
import { getColumn } from './column'

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export default class Activity extends Model {
  static TABLE_NAME = 'activities'

  static async createProjectCreateActivity (projectId: string, createdBy: string, project: any): Promise<string | null> {
    const data = {
      title: project.title,
      industry: project.industry
    }
    return await this.createActivity(projectId, createdBy, ActivityType.PROJECT_CREATE, data)
  }

  static async createProjectUpdateTitleActivity (projectId: string, createdBy: string, title: string): Promise<string | null> {
    return await this.createActivity(projectId, createdBy, ActivityType.PROJECT_UPDATE_TITLE, { title })
  }

  static async createProjectUpdateDescriptionActivity (projectId: string, createdBy: string): Promise<string | null> {
    return await this.createActivity(projectId, createdBy, ActivityType.PROJECT_UPDATE_DESCRIPTION)
  }

  static async createProjectUpdateIndustryActivity (projectId: string, createdBy: string, industry: string): Promise<string | null> {
    return await this.createActivity(projectId, createdBy, ActivityType.PROJECT_UPDATE_INDUSTRY, { industry })
  }

  static async createProjectUserAddActivity (projectId: string, createdBy: string, userId: string): Promise<string | null> {
    return await this.createActivity(projectId, createdBy, ActivityType.PROJECT_USER_ADD, null, { userIds: [userId] })
  }

  static async createProjectUserRemoveActivity (projectId: string, createdBy: string, userId: string): Promise<string | null> {
    return await this.createActivity(projectId, createdBy, ActivityType.PROJECT_USER_REMOVE, null, { userIds: [userId] })
  }

  static async createRoleCreateActivity (projectId: string, createdBy: string, roleId: string, data: any): Promise<string | null> {
    return await this.createRoleUpdateActivity(projectId, createdBy, roleId, data, ActivityType.ROLE_CREATE)
  }

  static async createRoleUpdateActivity (projectId: string, createdBy: string, roleId: string, newData: any, activityType: ActivityType = ActivityType.ROLE_UPDATE): Promise<string | null> {
    const data: ActivityData = {}
    if (newData.title != null) data.title = true
    if (newData.desc !== null) data.description = true
    if (isEmpty(data)) return null
    return await this.createActivity(projectId, createdBy, ActivityType.ROLE_UPDATE, data, { roleId })
  }

  static async createRoleDeleteActivity (projectId: string, createdBy: string, roleId: string): Promise<string | null> {
    return await this.createActivity(projectId, createdBy, ActivityType.ROLE_DELETE, null, { roleId })
  }

  static async createRoleUserAddActivity (projectId: string, createdBy: string, roleId: string, userId: string): Promise<string | null> {
    return await this.createActivity(projectId, createdBy, ActivityType.ROLE_USER_ADD, null, { userIds: [userId], roleId })
  }

  static async createRoleUserRemoveActivity (projectId: string, createdBy: string, roleId: string, userId: string): Promise<string | null> {
    return await this.createActivity(projectId, createdBy, ActivityType.ROLE_USER_REMOVE, null, { userIds: [userId], roleId })
  }

  static async createCardUserAddActivity (cardId: string, createdBy: string, userId: string): Promise<string | null> {
    const card = await getCard(cardId)
    if (card == null) {
      // TODO: log error
      return null
    }
    return await this.createActivity(card.projectId as string, createdBy, ActivityType.CARD_USER_ADD, null, { cardId, userIds: [userId] })
  }

  static async createCardUserRemoveActivity (cardId: string, createdBy: string, userId: string): Promise<string | null> {
    const card = await getCard(cardId)
    if (card == null) {
      // TODO: log error
      return null
    }
    return await this.createActivity(card.projectId as string, createdBy, ActivityType.CARD_USER_REMOVE, null, { cardId, userIds: [userId] })
  }

  static async createCardDueDateAddActivity (projectId: string, createdBy: string, cardId: string, dueDate: number): Promise<string | null> {
    return await this.createActivity(projectId, createdBy, ActivityType.CARD_DUE_DATE_ADD, { dueDate }, { cardId })
  }

  static async createCardDueDateUpdateActivity (cardId: string, createdBy: string, dueDate: number): Promise<string | null> {
    const card = await getCard(cardId)
    if (card == null) {
      // TODO: log error
      return null
    }
    return await this.createActivity(card.projectId as string, createdBy, ActivityType.CARD_DUE_DATE_UPDATE, { dueDate }, { cardId })
  }

  static async createCardDueDateDeleteActivity (projectId: string, createdBy: string, cardId: string): Promise<string | null> {
    return await this.createActivity(projectId, createdBy, ActivityType.CARD_DUE_DATE_DELETE, null, { cardId })
  }

  static async createActivity (projectId: string, createdBy: string, type: ActivityType, data?: any, subjectEntity?: { userIds?: string[], questionId?: string, commentId?: string, roleId?: string, cardId?: string }): Promise<string | null> {
    const activity: ActivityTypeDef = {
      _id: new ObjectId(),
      projectId: toObjectId(projectId),
      createdBy: toObjectId(createdBy),
      type,
      data,
      createdAt: new Date(),
      updatedAt: new Date(),
      visibility: ActivityVisibility.PUBLIC
    }
    if (subjectEntity?.userIds != null) activity.userIds = subjectEntity.userIds.map(toObjectId)
    if (subjectEntity?.questionId != null) activity.questionId = toObjectId(subjectEntity.questionId)
    if (subjectEntity?.commentId != null) activity.commentId = toObjectId(subjectEntity.commentId)
    if (subjectEntity?.roleId != null) activity.roleId = toObjectId(subjectEntity.roleId)

    return await this.create(activity)
  }

  static async createCardStageUpdateActivity (cardId: string, userId: string, stage: CardStage): Promise<string | null> {
    const card = await getCard(cardId)
    if (card == null) {
      // TODO: log error
      return null
    }
    return await this.createActivity(card.projectId as string, userId, ActivityType.CARD_STAGE_UPDATE, { stage }, { cardId })
  }

  static async createCardColumnUpdateActivity (cardId: string, userId: string, columnId: string): Promise<string | null> {
    const card = await getCard(cardId)
    if (card == null) {
      // TODO: log error
      return null
    }
    const column = await getColumn(columnId)
    return await this.createActivity(card.projectId as string, userId, ActivityType.CARD_COLUMN_UPDATE, { columnName: column.name }, { cardId })
  }

  static async createCommentCreateActivity (comment: CommentType): Promise<string | null> {
    const { projectId, userId, _id: commentId, userIds, questionId, cardId } = comment
    if (userIds != null && userIds?.length > 0) {
      return await this.createActivity(projectId, userId, ActivityType.COMMENT_CREATE_AND_MENTION, null, { commentId, userIds, cardId, questionId })
    }
    return await this.createActivity(projectId, userId, ActivityType.COMMENT_CREATE, null, { commentId, cardId, questionId })
  }

  static async createCommentDeleteActivity (commentId: string): Promise<string | null> {
    const result = await this.find({
      commentId: toObjectId(commentId),
      $or: [
        { type: ActivityType.COMMENT_CREATE_AND_MENTION },
        { type: ActivityType.COMMENT_CREATE }
      ]
    }, 1)
    const activity = result?.data[0]
    if (activity == null) {
      // TODO should be logged
      return null
    }
    const { projectId, createdBy } = activity
    return await this.createActivity(projectId, createdBy, ActivityType.COMMENT_DELETE, null, { commentId })
  }

  static async createCommentUpdateActivity (commentId: string): Promise<string | null> {
    const comment = await Comment.get({ _id: commentId })
    if (comment == null) return null
    const { projectId, userId, userIds, questionId, cardId } = comment
    if (userIds != null && userIds?.length > 0) {
      return await this.createActivity(projectId, userId, ActivityType.COMMENT_UPDATE_AND_MENTION, null, { commentId, userIds, cardId, questionId })
    }
    return await this.createActivity(projectId, userId, ActivityType.COMMENT_UPDATE, null, { commentId, cardId, questionId })
  }

  static async get (_id: string | ObjectId): Promise<ActivityTypeDef> {
    return await super.get<ActivityTypeDef>(_id)
  }

  static async find (where: any, limit: number = 500, sort: [field: string, order: number] = ['_id', 1], page?: string): Promise<{ count: number, limit: number, data: ActivityTypeDef[], page: string }> {
    return await super.find<ActivityTypeDef>(where, limit, sort, page)
  }
}
