/**
 * @jest-environment node
 */
import { givenAProject, givenAUserAcceptingNotifications, givenCommentTextData, setupMongoDB } from '@/util/test-utils'
import * as ProjectModel from '@/src/models/project'
import * as CardModel from '@/src/models/card'
import * as CommentModel from '@/src/models/comment'
import JobModel from '@/src/models/job'
import { JobMentionNotification } from '@/src/models/job/job-mention-notification'
import waitForExpect from 'wait-for-expect'
import * as Mail from '@/util/mail/index'
import { JobStatus } from '@/src/types/job'

// because of swc issue, we need to mock the module
jest.mock('../../util/mail/index', () => ({
  ...jest.requireActual('../../util/mail/index'),
  __esModule: true
}))

describe('Job', () => {
  setupMongoDB()

  describe('.findAndExecuteJobs()', () => {
    let spy: jest.SpyInstance
    let spy2: jest.SpyInstance
    let spy3: jest.SpyInstance
    let jobId: any
    let context: any
    beforeEach(async () => {
      const originalFn = JobMentionNotification.createMentionNotificationJob.bind(JobMentionNotification)
      const originalFn2 = Mail.sendMailToBcc
      const originalFn3 = JobMentionNotification.createJob.bind(JobMentionNotification)
      spy = jest.spyOn(JobMentionNotification, 'createMentionNotificationJob').mockImplementation(async (...args) => {
        jobId = await originalFn(args[0], 0) // overwrite delaySeconds to 0 !!!!
        return jobId
      })
      spy2 = jest.spyOn(Mail, 'sendMailToBcc').mockImplementation(async (...args) => {
        return await originalFn2(...args)
      })
      spy3 = jest.spyOn(JobMentionNotification, 'createJob').mockImplementation(async (...args) => {
        const [data, jobType] = args
        data.createdAt = new Date(Date.now() - 1000) // overwrite createdAt to 1 second ago to make it picked in the findAndExecuteJobs
        return await originalFn3(data, jobType)
      })
      const user = await givenAUserAcceptingNotifications()
      const user2 = await givenAUserAcceptingNotifications()
      const project = await givenAProject({}, user, true)
      await ProjectModel.addUser(project._id, user2._id)
      // const projectUpdated =
      await ProjectModel.getProject(project._id)
      const cards = await CardModel.getCards({ projectId: project._id })
      const [card] = cards
      const [question] = card.questions
      const commentText = givenCommentTextData([user2])
      const comment = await CommentModel.createCommentAndActivity({ text: commentText, projectId: String(project._id), questionId: question.id, cardId: card._id, userId: user._id })
      context = { user, user2, project, card, question, comment }
    })
    afterEach(() => {
      spy.mockRestore()
      spy2.mockRestore()
      spy3.mockRestore()
    })
    it('Executes a mention job', async () => {
      const { user2, comment } = context
      await waitForExpect(async () => {
        expect(spy).toBeCalled()
        expect(jobId).not.toBeUndefined()
      })
      await JobModel.findAndExecuteJobs()
      await waitForExpect(async () => {
        expect(Mail.sendMailToBcc).toBeCalled()
        expect(spy2).toBeCalled()
      })
      expect(spy2.mock.calls[0][3]?.includes(user2.email)).toBeTruthy()
      expect(spy2.mock.calls[0][1]?.includes(String(comment?._id))).toBeTruthy()
      const jobUpdated = await JobModel.get(jobId)
      expect(jobUpdated?.status).toBe(JobStatus.FINISHED)
    })

    it('Executes a job only once', async () => {
      const { user2, comment } = context
      await waitForExpect(async () => {
        expect(spy).toBeCalled()
        expect(jobId).not.toBeUndefined()
      })
      await JobModel.findAndExecuteJobs()
      await waitForExpect(async () => {
        expect(Mail.sendMailToBcc).toBeCalled()
        expect(spy2).toBeCalled()
      })
      expect(spy2.mock.calls[0][3]?.includes(user2.email)).toBeTruthy()
      expect(spy2.mock.calls[0][1]?.includes(String(comment?._id))).toBeTruthy()
      const jobUpdated = await JobModel.get(jobId)
      expect(jobUpdated?.status).toBe(JobStatus.FINISHED)
      await JobModel.findAndExecuteJobs()
      expect(spy2.mock.calls.length).toBe(1)
    })
  })
})
