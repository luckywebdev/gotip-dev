export default {
  changedValues: (name, value) => {
    return { type: 'LOGIN_INPUT', payload: { name: name, value: value } }
  },
  tryLogin: (email, password, isKeepLogin) => {
    return { type: 'TRY_LOGIN', payload: { email, password, isKeepLogin } }
  },
  tryLoginByToken: (token) => {
    return { type: 'TRY_LOGIN_BY_TOKEN', payload: { token } }
  },
  trySendRequest: (email) => {
    return { type: 'TRY_SEND_REQUEST', payload: { email } }
  },
  tryGoogleLogin: () => {
    return { type: 'TRY_GOOGLE_LOGIN', payload: { } }
  },
  tryFacebookLogin: () => {
    return { type: 'TRY_FACEBOOK_LOGIN', payload: { } }
  },
  tryTwitterLogin: () => {
    return { type: 'TRY_TWITTER_LOGIN', payload: { } }
  }
}