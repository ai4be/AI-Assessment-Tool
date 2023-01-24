
export enum JobType {
}

export interface ActivityData {
  name?: string
  industry?: string
  columnName?: string
  [key: string]: any
}

export enum JobStatus {
  SUCCESS = 'success',
  FAILED = 'failed',
  PENDING = 'pending',
  EXECUTING = 'executing',
  CANCELLED = 'cancelled'
}

export interface Job {
  _id?: string
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
}
