/**
 * @jest-environment node
 */
import { createMocks } from 'node-mocks-http'
import handler from '@/pages/api/users/[userId]/password'
import { givenAPassword, givenAUser, givenAnAuthenticationToken, setupMongoDB } from '@/util/test-utils'

const PATH = '/api/users/[projectId]/password'
// nextjs req will automatically parse the params from the url and add them to the query object but this is not done by node-mocks-http
const getUrl = (userId: string): string => `http://localhost:3000/api/users/${userId}/password?userId=${userId}`

describe(PATH, () => {
  setupMongoDB()

  describe('PATCH', () => {
    it('a user can update his password', async () => {
      const user = await givenAUser()
      const token = await givenAnAuthenticationToken(user, process.env.JWT_SECRET)
      const newPassword = givenAPassword()
      const { req, res } = createMocks({
        method: 'PATCH',
        url: getUrl(String(user._id)),
        headers: { Authorization: `Bearer ${token}` },
        cookies: {
          'next-auth.session-token': token
        },
        body: {
          currentPassword: user.password,
          newPassword
        }
      })
      await handler(req, res)
      expect(res._getStatusCode()).toBe(204)
    })

    it('fails when the credentials are wrong', async () => {
      const user = await givenAUser()
      const token = await givenAnAuthenticationToken(user, process.env.JWT_SECRET)
      const newPassword = givenAPassword()
      const { req, res } = createMocks({
        method: 'PATCH',
        url: getUrl(String(user._id)),
        headers: { Authorization: `Bearer ${token}` },
        cookies: {
          'next-auth.session-token': token
        },
        body: {
          currentPassword: 'wrong password',
          newPassword
        }
      })
      await handler(req, res)
      expect(res._getStatusCode()).toBe(400)
      const data = res._getData()
      expect(data.code).toBe(9001)
    })

    it('fails when the new password is too short', async () => {
      const user = await givenAUser()
      const token = await givenAnAuthenticationToken(user, process.env.JWT_SECRET)
      const newPassword = givenAPassword(7, 'P8$')
      const { req, res } = createMocks({
        method: 'PATCH',
        url: getUrl(String(user._id)),
        headers: { Authorization: `Bearer ${token}` },
        cookies: {
          'next-auth.session-token': token
        },
        body: {
          currentPassword: user.password,
          newPassword
        }
      })
      await handler(req, res)
      expect(res._getStatusCode()).toBe(400)
      const data = res._getData()
      expect(data.code).toBe(10004)
    })
  })
})
