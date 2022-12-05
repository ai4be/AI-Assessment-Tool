import type { NextApiRequest, NextApiResponse } from 'next'
// import { connectToDatabase } from '@/util/mongodb'

import data from '../../src/data'

// export const categories = [
//   {
//     _id: 'yvTpLjQEj',
//     key: 'fundamentals_rights',
//     name: 'fundamentals rights'
//   },
//   {
//     _id: '1cNHRoO09',
//     key: 'human_agency_and_oversight',
//     name: 'human agency and oversight'
//   },
//   {
//     _id: 'cU0LFRZHf',
//     key: 'technical_robustness_and_safety',
//     name: 'technical robustness and safety'
//   },
//   {
//     _id: 'Y4KKOKaA-',
//     key: 'privacy_and_data_governance',
//     name: 'privacy and data governance'
//   },
//   {
//     _id: 'bAwUMrTI_',
//     key: 'transparency',
//     name: 'transparency'
//   },
//   {
//     _id: 'j9Eb0CHf-',
//     key: 'diversity_non-discrimination_fairness',
//     name: 'diversity, non-discrimination, fairness'
//   },
//   {
//     _id: 'hPRvRD0KL',
//     key: 'societal_and_environmental_well-being',
//     name: 'societal and environmental well-being'
//   },
//   {
//     _id: 'zevtrJFvM',
//     key: 'accountability',
//     name: 'accountability'
//   }
// ]

export const categories = data.map(c => ({
  _id: c.id,
  key: c.title.toLowerCase().replace(/ /g, '_'),
  name: c.title
}))

console.log('categories', categories)

export default async function handler (req: NextApiRequest, res: NextApiResponse): Promise<void> {
  switch (req.method) {
    case 'GET': {
      return res.send(categories)
    }
    default:
      return res.status(404).send({ message: 'Not found' })
  }
}
