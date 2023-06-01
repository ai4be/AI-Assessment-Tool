/**
 * @jest-environment node
 */

import { faker } from '@faker-js/faker'
import { trimAndRemoveLastSlash } from '@/util/mail/templates'

describe('Util', () => {
  describe('.trimAndRemoveLastSlash()', () => {
    it('Keep the url unchanged if it is correct', async () => {
      const url = faker.internet.url()
      expect(trimAndRemoveLastSlash(url)).toEqual(url)
    })

    it('Removes trailing slash', async () => {
      const urlWithoutSlash = faker.internet.url()
      const url = urlWithoutSlash + '/'
      expect(/\/$/.test(url)).toBeTruthy()
      expect(trimAndRemoveLastSlash(url)).toEqual(urlWithoutSlash)
    })

    it('Removes trailing slash and trim spaces', async () => {
      const urlWithoutSlash = faker.internet.url()
      const url = '   ' + urlWithoutSlash + '/   '
      expect(trimAndRemoveLastSlash(url)).toEqual(urlWithoutSlash)
    })
  })
})
