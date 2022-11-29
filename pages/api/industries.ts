import type { NextApiRequest, NextApiResponse } from 'next'
// import { connectToDatabase } from '@/util/mongodb'

const industries = [
  'Accommodation and Food Services',
  'Administration, Business Support and Waste Management Services',
  'Agriculture, Forestry, Fishing and Hunting',
  'Arts, Entertainment and Recreation',
  'Construction',
  'Educational Services',
  'Finance and Insurance',
  'Healthcare and Social Assistance',
  'Information',
  'Manufacturing',
  'Mining',
  'Other Services,',
  'Professional, Scientific and Technical Services',
  'Public Sector',
  'Real Estate and Rental and Leasing',
  'Retail Trade',
  'Transportation and Warehousing',
  'Utilities',
  'Wholesale Trade'
].map((i, idx) => ({ name: i, key: i.toLowerCase().replace(/ /g, '_'), _id: idx }))

export default async function handler (req: NextApiRequest, res: NextApiResponse): Promise<void> {
  switch (req.method) {
    case 'GET': {
      return res.send(industries)
    }
    default:
      return res.status(404).send({ message: 'Not found' })
  }
}
