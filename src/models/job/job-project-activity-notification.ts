import { Job as JobInterface } from '@/src/types/job'
import { isEmpty } from '@/util/index'
import Activity from '@/src/models/activity'
import Job from '@/src/models/job'
import UserModel from '@/src/models/user'
import { ObjectId } from 'mongodb'
import { getUserProjects } from '@/src/models/project'
import { getProjectActivityHtml } from '@/util/mail/templates'
import { sendMailWithSelfInBcc } from '@/util/mail'

export interface JobProjectActivityNotificationData {
  projectIds: string[]
  userId: string
}

export class JobProjectActivityNotification extends Job {
  static JOB_TYPE = 'project-activity-notification'

  static async createProjectActivityNotificationJobs (): Promise<void> {
    const maxAgeDate = new Date(Date.now() - 60 * 60 * 1000 * 24) // last 24 hours
    let userResult = await UserModel.find({}, 500)
    console.log('createProjectActivityNotificationJobs')
    while (!isEmpty(userResult?.data)) {
      for (const user of userResult.data) {
        const projectIds: ObjectId[] = []
        const where = {
          createdAt: { $gt: maxAgeDate },
          createdBy: { $ne: user._id },
          seenBy: { $ne: user._id }
        }
        let activitieResult = await Activity.find(where, Activity.DEFAULT_LIMIT)
        console.log(activitieResult)
        while (!isEmpty(activitieResult?.data)) {
          for (const activity of activitieResult.data) {
            const { projectId } = activity
            if (projectId != null && !projectIds.includes(projectId)) projectIds.push(projectId)
          }
          if (!isEmpty(activitieResult.page)) activitieResult = await Activity.find(where, Activity.DEFAULT_LIMIT, Activity.DEFAULT_SORT, activitieResult.page)
          else break
        }
        console.log('projectIds', projectIds)
        if (!isEmpty(projectIds)) {
          const job: Partial<JobInterface> = {
            data: {
              projectIds,
              userId: user._id
            }
          }
          await this.createJob(job, this.JOB_TYPE)
        }
      }
      if (!isEmpty(userResult.page)) userResult = await UserModel.find({}, UserModel.DEFAULT_LIMIT, Activity.DEFAULT_SORT, userResult.page)
      else break
    }
  }

  async run (): Promise<any> {
    const { projectIds, userId } = this.data as JobProjectActivityNotificationData
    const user = await UserModel.get(userId)
    if (user == null) throw Error(`User not found: ${userId}`)
    const projects = await getUserProjects(userId, projectIds)
    if (isEmpty(projects)) throw Error(`No projects found for user: ${userId}`)
    const html = getProjectActivityHtml(projects)
    this.result = await sendMailWithSelfInBcc(user.email, 'New Project Activity', html)
  }
}
