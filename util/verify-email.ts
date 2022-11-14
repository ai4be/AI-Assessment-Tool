
const verifyEmail = async (ctx) => {
  const { email } = ctx.query
  const isTokenValid = await fetch(`/api/verify-email?email=${email}`)
  const json = await isTokenValid.json()

  // If user exists return true
  if (json.message === 'Found') {
    return true
  } else return false
}

export default verifyEmail
