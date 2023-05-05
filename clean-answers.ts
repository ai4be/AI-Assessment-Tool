import { defaultCards } from './src/data'
import { connectToDatabase } from './src/models/mongodb'
import { dataToCards } from './src/models/card'

async function cleanAnswersDb (): Promise<void> {
  const cardsData = await dataToCards(defaultCards)
  const newQuestions = cardsData.flatMap(c => c.questions)

  const { db } = await connectToDatabase()
  const cursor = db.collection('cards').find()
  while (await cursor.hasNext()) {
    const doc = await cursor.next()
    const { questions } = doc
    if (Array.isArray(questions)) {
      for (const q of questions) {
        const jsonQ = newQuestions.find(nq => nq.id === q.id)
        let { answers } = q
        if (Array.isArray(answers) && jsonQ != null && Array.isArray(jsonQ.answers)) {
          answers = answers.map((a: any) => {
            if (typeof a !== 'string') return a
            const jsonA = jsonQ.answers.find((a2: any) => a2.answer === a)
            if (jsonA == null) return a
            return jsonA
          })
          await db.collection('cards').updateOne(
            { _id: doc._id, 'questions.id': q.id },
            {
              $set: {
                'questions.$.answers': answers
              }
            }
          )
        } else {
          console.log('no answers', q.id, jsonQ, answers)
        }
      }
    }
  }
}

void cleanAnswersDb().then(() => console.log('done')).catch(console.error)
