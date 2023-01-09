
export enum ActivityType {
  PROJECT_CREATE = 'project_create',
  PROJECT_UPDATE_TITLE = 'project_update_title',
  PROJECT_UPDATE_DESCRIPTION = 'project_update_description',
  PROJECT_UPDATE_INDUSTRY = 'project_update_description',
  PROJECT_UPDATE = 'project_update',
  PROJECT_USER_ADD = 'project_user_add',
  PROJECT_USER_REMOVE = 'project_user_remove',
  ROLE_CREATE = 'role_create',
  ROLE_UPDATE = 'role_update',
  ROLE_DELETE = 'role_delete',
  ROLE_USER_ADD = 'role_user_add',
  ROLE_USER_REMOVE = 'project_role_user_remove',
  COMMENT_CREATE = 'comment_create',
  COMMENT_UPDATE = 'comment_update',
  COMMENT_DELETE = 'comment_delete',
  COMMENT_MENTION = 'comment_mention',
  COMMENT_CREATE_AND_MENTION = 'comment_create_and_mention',
  COMMENT_UPDATE_AND_MENTION = 'comment_update_and_mention',
  CARD_USER_ADD = 'card_user_add',
  CARD_USER_REMOVE = 'card_user_remove',
  CARD_DUE_DATE_ADD = 'card_due_date_add',
  CARD_DUE_DATE_UPDATE = 'card_due_date_update',
  CARD_DUE_DATE_DELETE = 'card_due_date_delete',
  CARD_COLUMN_UPDATE = 'card_column_update',
  CARD_STAGE_UPDATE = 'card_stage_update',
  QUESTION_ANSWER_CREATE = 'question_answer_create',
  QUESTION_ANSWER_UPDATE = 'question_answer_update'
}

export enum ActivityVisibility {
  PUBLIC = 0
}

export interface ActivityData {
  [key: string]: any
}

export interface Activity {
  _id: string
  createdAt: Date
  type: ActivityType
  createdBy: string
  projectId: string
  visibility: number
  updatedAt?: Date
  data?: ActivityData
  userIds?: string[]
  roleId?: string
  cardId?: string
  commentId?: string
  questionId?: string
}
