import { ObjectId } from 'mongodb'
import { connectToDatabase } from '@/src/models/mongodb'
import Model from '@/src/models/model'
import { Job as JobInterface, JobStatus } from '@/src/types/job'

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export default class Job extends Model implements JobInterface {
  static TABLE_NAME = 'jobs'
  static JOB_TYPE = 'base'

  _id: ObjectId
  createdAt: number
  type: string
  data?: any
  updatedAt?: number
  delaySeconds: number
  status: JobStatus
  error?: string
  result?: any
  runAt?: number
  finishedAt?: number
  runCount: number

  constructor (job: JobInterface) {
    super()
    this._id = job._id
    this.createdAt = job.createdAt
    this.type = job.type
    this.data = job.data
    this.updatedAt = job.updatedAt
    this.delaySeconds = job.delaySeconds
    this.status = job.status
    this.error = job.error
    this.result = job.result
    this.runAt = job.runAt
    this.finishedAt = job.finishedAt
    this.runCount = job.runCount
  }

  static async createJob (data: Partial<Job>, type: string = this.JOB_TYPE): Promise<string | null> {
    const { db } = await connectToDatabase()
    const job: JobInterface = {
      _id: new ObjectId(),
      createdAt: Date.now(),
      type,
      status: JobStatus.PENDING,
      delaySeconds: 0,
      runCount: 0,
      ...data
    }
    const res = await db.collection(this.TABLE_NAME).insertOne(job)
    return res.result.ok === 1 ? String(job._id) : null
  }

  static async executeJob (job: Job): Promise<void> {
    const { db } = await connectToDatabase()
    await db.collection(this.TABLE_NAME).updateOne({ _id: job._id }, { status: JobStatus.EXECUTING, runAt: Date.now() })
    let error = null
    try {
      await job.run()
    } catch (e) {
      error = e.message
    }
    await db
      .collection(this.TABLE_NAME)
      .updateOne({ _id: job._id }, {
        status: error != null ? JobStatus.FAILED : job.status,
        error: job.error ?? error,
        result: job.result,
        finishedAt: Date.now(),
        runCount: job.runCount + 1
      })
  }

  static async getJobsToExecute (): Promise<JobInterface[]> {
    const { db } = await connectToDatabase()
    const where: any = {
      $expr: {
        $gt: [
          {
            $datediff: {
              startDate: new Date(),
              endDate: '$createdAt',
              unit: 'second'
            }
          },
          '$delaySeconds'
        ]
      },
      $or: [{ status: JobStatus.PENDING }, { status: JobStatus.FAILED, runCount: { $lt: 3 } }]
    }
    const jobs = await db
      .collection(this.TABLE_NAME)
      .find(where).toArray()

    return jobs
  }

  async run (): Promise<boolean> {
    throw new Error('Not implemented')
  }
}
