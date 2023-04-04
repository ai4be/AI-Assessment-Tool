require('dotenv').config()
const cron = require('node-cron')

const {
  BASE_URL = 'http://localhost:3000',
  API_KEY = 'todo'
} = process.env

console.log('BASE_URL', BASE_URL)
console.log('API_KEY', API_KEY?.slice(0, 5), '...')

const fetchOptions = {
  cache: 'no-cache',
  credentials: 'same-origin',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': API_KEY
  },
  redirect: 'follow',
  referrerPolicy: 'no-referrer',
  method: 'POST'
}

cron.schedule('0 20 * * *', async () => {
  const url = `${BASE_URL}/api/jobs/digest`
  console.log('running a task', url)
  const response = await fetch(url, { ...fetchOptions })
  const data = await response.json()
  console.log(data)
})
