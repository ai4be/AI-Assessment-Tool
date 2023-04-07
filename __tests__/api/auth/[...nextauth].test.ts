/**
 * @jest-environment node
 */
import { createMocks } from 'node-mocks-http'
import handler from '@/pages/api/auth/[...nextauth]'
import { givenAUser, setupMongoDB } from '@/util/test-utils'

describe('/api/auth/[...nextauth]', () => {
  setupMongoDB()

  it('returns a message with the specified animal', async () => {
    const user = await givenAUser()
    const { req, res } = createMocks({
      method: 'GET',
      url: 'http://localhost:3000/api/auth/csrf',
      query: {
        action: 'csrf',
        nextauth: ['csrf', 'credentials']
      }
    })
    await handler(req, res)
    // console.log(res)
    expect(res._getStatusCode()).toBe(200)
    // console.log(res._getData())
    const data = res._getData()
    // console.log("COOKIES", res._getHeaders())
    // console.log("COOKIES", res._headers['set-cookie'])
    expect(Object.keys(data)).toContain('csrfToken')

    const cookies = res._headers['set-cookie']
    const transformedCookies: any = {}
    for (const cookie of cookies) {
      let [key, value] = cookie.split('=')
      value = value.split(';')[0]
      value = decodeURIComponent(value)
      transformedCookies[key] = value
    }

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
    // console.log(res2)
    // console.log(res2._getStatusCode())
    // console.log(res2._getData())

    // expect(res._getStatusCode()).toBe(200)
    // expect(JSON.parse(res._getData())).toEqual(
    //   expect.objectContaining({
    //     message: 'Your favorite animal is dog'
    //   })
    // )
  })
})
