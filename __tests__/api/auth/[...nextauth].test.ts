/**
 * @jest-environment node
 */
import { createMocks } from 'node-mocks-http'
import handler from '@/pages/api/auth/[...nextauth]'
import { givenAUser, setupMongoDB } from '@/util/test-utils'
import { decode } from 'next-auth/jwt'

describe('/api/auth/[...nextauth]', () => {
  setupMongoDB()

  it('existing user can login', async () => {
    const user = await givenAUser()
    // 1. Get CSRF token
    const { req, res } = createMocks({
      method: 'GET',
      url: 'http://localhost:3000/api/auth/csrf',
      query: {
        action: 'csrf',
        nextauth: ['csrf', 'credentials']
      }
    })
    await handler(req, res)
    expect(res._getStatusCode()).toBe(200)
    const data = res._getData()
    expect(Object.keys(data)).toContain('csrfToken')

    const cookies = res._headers['set-cookie']
    const transformedCookies: any = {}
    for (const cookie of cookies) {
      let [key, value] = cookie.split('=')
      value = value.split(';')[0]
      value = decodeURIComponent(value)
      transformedCookies[key] = value
    }

    // 2. Login
    const { req: req2, res: res2 } = createMocks({
      method: 'POST',
      cookies: transformedCookies,
      query: {
        action: 'callback',
        nextauth: ['callback', 'credentials']
      },
      url: 'http://localhost:3000/api/auth/callback/credentials?',
      body: {
        password: user.password,
        email: user.email,
        json: true,
        redirect: false,
        callbackUrl: 'http://localhost:3000/login',
        csrfToken: data.csrfToken
      }
    })

    await handler(req2, res2)
    const cookies2 = res2._headers['set-cookie']
    const nextAuthSessionToken = cookies2.find(c => c.includes('next-auth.session-token')).split(';')[0].split('=')[1]
    const decoded = await decode({
      token: nextAuthSessionToken,
      secret: String(process.env.JWT_SECRET_KEY)
    })
    expect(decoded?.email).toEqual(user.email)
    expect(decoded?.sub).toEqual(String(user._id))
  })
})
