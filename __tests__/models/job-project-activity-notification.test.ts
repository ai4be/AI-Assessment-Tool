/**
 * @jest-environment node
 */
import { givenAProject, givenAUser, setupMongoDB } from '@/util/test-utils'
import * as ProjectModel from '@/src/models/project'
import * as CardModel from '@/src/models/card'
import JobModel from '@/src/models/job'
import { JobProjectActivityNotification } from '@/src/models/job/job-project-activity-notification'
// import waitForExpect from 'wait-for-expect'
import * as Mail from '@/util/mail/index'
import { JobStatus } from '@/src/types/job'

// because of swc issue, we need to mock the module
jest.mock('../../util/mail/index', () => ({
  ...jest.requireActual('../../util/mail/index'),
  __esModule: true
}))

const baseExpect = async (context: any): Promise<void> => {
  const { user2, user3 } = context
  const userIds = [String(user2._id), String(user3._id)]
  const jobIds = await JobProjectActivityNotification.createProjectActivityNotificationJobs()
  expect(jobIds).toHaveLength(2)
  for (const jobId of jobIds) {
    const job = await JobModel.get(jobId)
    const strUserId = String(job?.data?.userId)
    // console.log('job', JSON.stringify(job, null, 2))
    expect(job).toBeDefined()
    expect(job?.status).toEqual(JobStatus.PENDING)
    expect(job?.type).toEqual(JobProjectActivityNotification.JOB_TYPE)
    expect(job?.data).toBeDefined()
    expect(userIds).toContain(strUserId)
    if (strUserId === String(user3._id)) {
      expect(job?.data?.latestActivityPerProject).toHaveLength(2)
      expect(job?.data?.latestActivityPerProject.every((a: any) => a.sent == null)).toBeTruthy()
    } else {
      expect(job?.data?.latestActivityPerProject).toHaveLength(1)
    }
  }
}

describe('Job', () => {
  setupMongoDB()
  let spy: jest.SpyInstance
  let spy2: jest.SpyInstance
  let spy3: jest.SpyInstance
  let context: any
  beforeAll(async () => {
    const originalFn = JobProjectActivityNotification.createProjectActivityNotificationJobs.bind(JobProjectActivityNotification)
    const originalFn2 = Mail.sendMailToBcc
    const originalFn3 = JobProjectActivityNotification.createJob.bind(JobProjectActivityNotification)
    spy = jest.spyOn(JobProjectActivityNotification, 'createProjectActivityNotificationJobs').mockImplementation(async (...args) => {
      return await originalFn(...args)
    })
    spy2 = jest.spyOn(Mail, 'sendMailToBcc').mockImplementation(async (...args) => {
      return await originalFn2(...args)
    })
    spy3 = jest.spyOn(JobProjectActivityNotification, 'createJob').mockImplementation(async (...args) => {
      const [data, jobType] = args
      data.createdAt = new Date(Date.now() - 1000) // overwrite createdAt to 1 second ago to make it picked in the findAndExecuteJobs
      return await originalFn3(data, jobType)
    })
  })
  beforeEach(async () => {
    const user1 = await givenAUser()
    const user2 = await givenAUser()
    const user3 = await givenAUser()
    const project1 = await givenAProject({}, user1, true)
    const project2 = await givenAProject({}, user2, true)
    await ProjectModel.addUser(project1._id, user2._id)
    await ProjectModel.addUser(project1._id, user3._id)
    await ProjectModel.addUser(project2._id, user3._id)
    context = { user1, user2, user3, project1, project2 }
  })
  afterEach(() => {
    spy.mockClear()
    spy2.mockClear()
    spy3.mockClear()
  })
  afterAll(() => {
    spy.mockRestore()
    spy2.mockRestore()
    spy3.mockRestore()
  })

  describe('.createProjectActivityNotificationJobs()', () => {
    it('Creates the jobs', async () => {
      await baseExpect(context)
    })

    it('Sends activities only once', async () => {
      const { user1, user2, user3, project1 } = context
      await baseExpect(context)
      const jobIds2 = await JobProjectActivityNotification.createProjectActivityNotificationJobs()
      expect(jobIds2).toHaveLength(0)
      const jobIds3 = await JobProjectActivityNotification.createProjectActivityNotificationJobs()
      expect(jobIds3).toHaveLength(0)

      const cards = await CardModel.getCards({ projectId: project1._id })
      await CardModel.addUserToCardAndCreateActivity(cards[0]._id, user3._id, user2._id)
      const jobIds4 = await JobProjectActivityNotification.createProjectActivityNotificationJobs()
      const userIds2 = [String(user1._id), String(user2._id)]
      for (const jobId of jobIds4) {
        const job = await JobModel.get(jobId)
        const strUserId = String(job?.data?.userId)
        expect(job).toBeDefined()
        expect(job?.status).toEqual(JobStatus.PENDING)
        expect(job?.type).toEqual(JobProjectActivityNotification.JOB_TYPE)
        expect(job?.data).toBeDefined()
        expect(userIds2.includes(strUserId)).toBeTruthy()
        expect(job?.data?.latestActivityPerProject).toHaveLength(1)
      }
    })
    it('Sends activities only once 2', async () => {
      const { user1, user2, user3, project2 } = context
      await baseExpect(context)
      const cards = await CardModel.getCards({ projectId: project2._id })
      await CardModel.addUserToCardAndCreateActivity(cards[0]._id, user3._id, user2._id)
      const jobIds2 = await JobProjectActivityNotification.createProjectActivityNotificationJobs()
      const userIds2 = [String(user1._id), String(user2._id)]
      for (const jobId of jobIds2) {
        const job = await JobModel.get(jobId)
        const strUserId = String(job?.data?.userId)
        expect(job).toBeDefined()
        expect(job?.status).toEqual(JobStatus.PENDING)
        expect(job?.type).toEqual(JobProjectActivityNotification.JOB_TYPE)
        expect(job?.data).toBeDefined()
        expect(userIds2.includes(strUserId)).toBeTruthy()
        // expect(job?.data?.latestActivityPerProject).toHaveLength(1)
      }
    })
  })
})
