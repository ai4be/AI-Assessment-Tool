/**
 * @jest-environment node
 */
import { ObjectId } from 'mongodb'
import { sanitize } from '@/src/models/mongodb'

// because of swc issue, we need to mock the module
jest.mock('../../util/mail/index', () => ({
  ...jest.requireActual('../../util/mail/index'),
  __esModule: true
}))

describe('Mongodb', () => {
  describe('.sanitize()', () => {
    it('Does not replace ObjectId', async () => {
      const id = ObjectId()
      const returnedData = sanitize(id)
      expect(returnedData).toBe(id)
    })
    it('Does not replace ObjectId when it is a value', async () => {
      const id = ObjectId()
      const obj = {
        id
      }
      const returnedData = sanitize(obj)
      expect(returnedData).toBe(obj)
      expect(returnedData.id).toBe(obj.id)
    })
    it('Replace object properties including a $', async () => {
      const id = ObjectId()
      const obj = {
        $id: {
          $oid: id,
          'test.$oid': id
        },
        '$id.$oid.test.$prop': id
      }
      const returnedData = sanitize(obj)
      expect(returnedData.$id).toBeUndefined()
      expect(returnedData.id).toBe((obj as any).id)
      expect(returnedData.id.$oid).toBeUndefined()
      expect((obj as any)['$id.$oid.adfadsf.$adf']).toBeUndefined()
      expect((obj as any)['id.oid.test.prop']).toBeDefined()
    })
    it('Does not change an array', async () => {
      const id = ObjectId()
      const arr = [id, 1, '2323']
      const returnedData = sanitize(arr)
      expect(returnedData).toBe(arr)
      let idx = 0
      for (const el of arr) {
        expect(el).toBe(arr[idx])
        idx++
      }
    })
  })
})
