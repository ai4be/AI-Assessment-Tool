/**
 * @jest-environment node
 */
import { ObjectId } from 'mongodb'
import { givenAUser, setupMongoDB, givenAProject } from '@/util/test-utils'
import * as CardModel from '@/src/models/card'
import { defaultCards } from '@/src/data'
import { Card } from '@/src/types/card'
import { Project } from '@/src/types/project'
import { User } from '@/src/types/user'

describe('Card', () => {
  setupMongoDB()
  describe('.dataToCards()', () => {
    let cards: Card[]
    let cards2: Card[]
    beforeAll(async () => {
      cards = await CardModel.dataToCards(defaultCards)
      const projectId = ObjectId()
      const columnId = ObjectId()
      cards2 = await CardModel.dataToCards(defaultCards, projectId, columnId)
    })

    it('Adds the number of categories from the JSON file', async () => {
      const categories = cards.map(card => card.category)
      const uniqueCategories = [...new Set(categories)]
      expect(uniqueCategories.length).toEqual(defaultCards.length)
    })

    it('Add TOC number to the cards', async () => {
      expect(cards.every(card => card.TOCnumber != null)).toBeTruthy()
    })

    it('Add TOC number to the questions', async () => {
      const questions = cards.flatMap(card => card.questions)
      expect(questions.every(question => question.TOCnumber != null)).toBeTruthy()
    })

    it('Does not add the project ID to the cards if not given', async () => {
      expect(cards.every(card => card.projectId === undefined)).toBeTruthy()
    })

    it('Does not add the column ID to the cards if not given', async () => {
      expect(cards.every(card => card.columnId === undefined)).toBeTruthy()
    })

    it('Add the project ID to the cards if given', async () => {
      expect(cards2.every(card => card.projectId != null)).toBeTruthy()
    })

    it('Add the column ID to the cards if given', async () => {
      expect(cards2.every(card => card.columnId != null)).toBeTruthy()
    })
  })
  describe('.cardDataSanitizer()', () => {
    let cards: Card[]
    let card: Card
    let project: Project
    let user: User
    beforeEach(async () => {
      user = await givenAUser() as any as User
      project = await givenAProject({}, user, true)
      cards = await CardModel.getCards({ projectId: project._id })
      card = cards[0]
    })

    it('allows dueDate as timestamp and format it to a date', async () => {
      const data = {
        dueDate: new Date().getTime()
      }

      const returnedData = await CardModel.cardDataSanitizer(card._id, data)
      expect(returnedData.dueDate).toBeInstanceOf(Date)
      expect(+returnedData.dueDate).toEqual(data.dueDate)
    })
    it('allows dueDate as timestamp in seconds and format it to a date', async () => {
      const data = {
        dueDate: Math.floor(new Date().getTime() / 1000)
      }

      const returnedData = await CardModel.cardDataSanitizer(card._id, data)
      expect(returnedData.dueDate).toBeInstanceOf(Date)
      expect((+returnedData.dueDate) / 1000).toEqual(data.dueDate)
    })
    it('allows dueDate as timestamp in string format and format it to a date', async () => {
      const data = {
        dueDate: `${new Date().getTime()}`
      }

      const returnedData = await CardModel.cardDataSanitizer(card._id, data)
      expect(returnedData.dueDate).toBeInstanceOf(Date)
      expect(+returnedData.dueDate).toEqual(+data.dueDate)
    })
    it('allows dueDate as iso datetime string and format it to a date', async () => {
      const data = {
        dueDate: new Date().toISOString()
      }

      const returnedData = await CardModel.cardDataSanitizer(card._id, data)
      expect(returnedData.dueDate).toBeInstanceOf(Date)
      expect(returnedData.dueDate.toISOString()).toEqual(data.dueDate)
    })
  })
})
