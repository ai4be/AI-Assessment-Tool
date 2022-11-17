import type { NextApiRequest, NextApiResponse } from 'next'
// import { connectToDatabase } from '@/util/mongodb'

export const categories = [
  {
    _id: 'yvTpLjQEj',
    key: 'fundamentals_rights',
    name: 'fundamentals rights'
  },
  {
    _id: '1cNHRoO09',
    key: 'human_agency_and_oversight',
    name: 'human agency and oversight'
  },
  {
    _id: 'cU0LFRZHf',
    key: 'technical_robustness_and_safety',
    name: 'technical robustness and safety'
  },
  {
    _id: 'Y4KKOKaA-',
    key: 'privacy_and_data_governance',
    name: 'privacy and data governance'
  },
  {
    _id: 'bAwUMrTI_',
    key: 'transparency',
    name: 'transparency'
  },
  {
    _id: 'j9Eb0CHf-',
    key: 'diversity_non-discrimination_fairness',
    name: 'diversity, non-discrimination, fairness'
  },
  {
    _id: 'hPRvRD0KL',
    key: 'societal_and_environmental_well-being',
    name: 'societal and environmental well-being'
  },
  {
    _id: 'zevtrJFvM',
    key: 'accountability',
    name: 'accountability'
  }
]

export default async function handler (req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const requestType = req.method
  switch (requestType) {
    case 'GET': {
      return res.send(categories)
    }
    default:
      res.send({ message: 'DB error' })
      break
  }
}
