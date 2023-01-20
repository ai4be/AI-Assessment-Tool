import { nextCsrf } from './csrf-temp'

const { csrf, setup } = nextCsrf({
  // eslint-disable-next-line no-undef
  secret: process.env.CSRF_SECRET ?? 'yB32s%@nNY24^w8BDnn^eoNNz4U&9bc3$i7Fo#YR9BGs!yntkPy%x7AxD4tBVrv!ih$ADum&'
})

export { csrf, setup }
