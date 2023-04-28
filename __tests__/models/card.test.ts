/**
 * @jest-environment node
 */
import { ObjectId } from 'mongodb'
import * as CardModel from '@/src/models/card'
import { defaultCards } from '@/src/data'
import { Card } from '@/src/types/card'

describe('Card', () => {
  describe('dataToCards()', () => {
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
})
