
const verifyToken = async (ctx) => {
  const { token } = ctx.query
  const isTokenValid = await fetch(`/api/verify-token?token=${token}`)
  const json = await isTokenValid.json()

  if (json.message === 'valid') {
    return true
  } else return false
}

export default verifyToken
