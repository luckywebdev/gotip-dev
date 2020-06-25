const initialState = {
  birthdate: {}
}

export default (state = initialState, action) => {
  let newState = {}
  switch (action.type) {
    case 'REGISTRATION_INPUT':
      Object.assign({}, newState, action.payload);
      break;
    case 'CHECKED_UID':
      newState.isUidAvailable = action.payload.isAvailable
      break 
    case 'SUCCESSFUL_REGISTER':
      newState.result = true
      break
    case 'FAILED_REGISTER':
      newState.result = false
      newState.errMessage = action.payload.errMessage
      break
    case 'SET_ACCOUNT_INFO':
      const userInfo = {}
      if (action.payload && typeof action.payload === 'object') Object.keys(action.payload).forEach(key => {
        switch (key) {
          case 'name':
            userInfo.name = action.payload[key].value
            userInfo.nickname = action.payload[key].nickname
            userInfo.ruby = action.payload[key].ruby
            break
          default:
            userInfo[key] = action.payload[key]
        }
      })
      if (!userInfo.birthdate) userInfo.birthdate = {}
      return userInfo
  }
  return Object.assign({}, state, newState)
}