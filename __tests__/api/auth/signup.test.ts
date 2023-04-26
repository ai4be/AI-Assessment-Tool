/**
 * @jest-environment node
 */
import { createMocks } from 'node-mocks-http'
import handler from '@/pages/api/auth/signup'
import { givenAUser, givenUserData, setupMongoDB } from '@/util/test-utils'
import apiResponseCodes from '@/public/locales/en/api-messages.json'
import { faker } from '@faker-js/faker'

const PATH = '/api/auth/signup'
const url = `http://localhost:3000${PATH}`
const method = 'POST'

describe(PATH, () => {
  setupMongoDB()

  it('user can singup', async () => {
    const userData = givenUserData()
    const { req, res } = createMocks({
      method,
      url,
      body: { ...userData, confirmPassword: userData.password }
    })
    await handler(req, res)
    const data = res._getData()
    expect(res._getStatusCode()).toBe(201)
    expect(data).toHaveProperty('code')
    expect(data.code).toEqual(11005)
  })

  it('user cannot singup with email already existing in the db', async () => {
    const user = await givenAUser()
    const { req, res } = createMocks({
      method,
      url,
      body: { ...user, confirmPassword: user.password }
    })
    await handler(req, res)
    expect(res._getStatusCode()).toBe(422)
    const data = res._getData()
    const decodedData = JSON.parse(data)
    expect(decodedData).toHaveProperty('code')
    expect(decodedData.code).toEqual(11004)
    expect((apiResponseCodes as any)[decodedData.code as key]).toMatch(/email .*/i)
  })

  it('user cannot singup with too short password', async () => {
    const user = givenUserData({ password: faker.internet.password(7) })
    const { req, res } = createMocks({
      method,
      url,
      body: { ...user, confirmPassword: user.password }
    })
    await handler(req, res)
    expect(res._getStatusCode()).toBe(422)
    const data = res._getData()
    const decodedData = JSON.parse(data)
    expect(decodedData).toHaveProperty('code')
    expect((apiResponseCodes as any)[decodedData.code] as string).toMatch(/password .*/i)
  })

  it('user cannot singup with password not containing a special character', async () => {
    const user = givenUserData({ password: faker.random.alphaNumeric(10) })
    const { req, res } = createMocks({
      method,
      url,
      body: { ...user, confirmPassword: user.password }
    })
    await handler(req, res)
    expect(res._getStatusCode()).toBe(422)
    const data = res._getData()
    const decodedData = JSON.parse(data)
    expect(decodedData).toHaveProperty('code')
    expect((apiResponseCodes as any)[decodedData.code] as string).toMatch(/password .*/i)
  })
})
