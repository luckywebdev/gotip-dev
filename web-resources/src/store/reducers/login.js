const initialState = {
  isLoading: false,
  failedCount: 0,
  user: {},
  errMessage: '',
  historyRedirect: '/main'
}

export default (state = initialState, action) => {
  let newState = {}
  switch (action.type) {
    case 'LOGIN_INPUT':
      if (action.payload.name && typeof action.payload.value !== 'undefined')
      newState[action.payload.name] = action.payload.value
      break
    case 'SUCCESSFUL_LOGIN':
      newState = {
        user : {
          uid: action.payload.uid,
          auth_level: action.payload.auth_level,
          isVerified: action.payload.isVerified,
        },
        failedCount: 0,
        isLoading: true,
        historyRedirect: '/main'
      }
      break
    case 'FAILED_LOGIN':
      newState = {
        failedCount: state.failedCount + 1,
        errMessage: action.payload.errMessage
      }
      break;
    case 'SUCCESSFUL_REQUEST':
      newState.resetRequest = true;
      break;
    case 'FAILED_REQUEST':
      newState.resetRequest = false;
      newState.errMessage = action.payload.errMessage;
      break;
    default:
  }
  return Object.assign({}, state, newState)
}