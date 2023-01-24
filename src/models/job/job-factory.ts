import { JobProjectActivityNotification } from './job-project-activity-notification'
import { JobMentionNotification } from './job-mention-notification'
import { Job as JobInterface } from '@/src/types/job'
import Job from './index'

export function jobFactory (job: JobInterface): Job {
  switch (job.type) {
    case JobProjectActivityNotification.JOB_TYPE:
      return new JobProjectActivityNotification(job)
    case JobMentionNotification.JOB_TYPE:
      return new JobMentionNotification(job)
    default:
      throw new Error('Job type not found')
  }
}
