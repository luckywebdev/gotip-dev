const initialState = {
  show_state: false,
  loadingMessage: null,
  gettingState: false
}

export default (state = initialState, action) => {
  let newState = {}
  switch (action.type) {
    case 'GoTip_SHOW_SUCCESS':
      newState = {
        show_state: action.payload
      }
      break;
    case 'SET_LOADING_TEXT':
      newState.loadingMessage = action.payload
      break;
    case 'SET_ACCOUNT_INFO':
      newState.user = action.payload
      newState.authLevel = action.payload && action.payload.authLevel ? action.payload.authLevel : 1
      break;
    case 'SET_REDIRECT':
      newState.historyRedirect = action.payload
      break;
    case 'SET_LOADING_TEXT':
      newState.loadingMessage = action.payload
      break;
    case 'CHANGE_LOGIN_STATE':
      newState.isLogedIn = action.payload.isLogedIn
      newState.gettingState = action.payload.gettingState
      break;
    case 'SET_POINTS_INFO':
      newState.points = action.payload ? action.payload : {}
      newState.points.amount = Array.isArray(action.payload.data) ?
        action.payload.data.reduce((prev, current, i) => {
          const prevValue = typeof prev === 'object' && !isNaN(prev.value) ? prev.value : !isNaN(prev) ? prev : 0
          const currentValue = current && !current.expired && typeof current.value === 'number' ? current.value : 0
          return prevValue + currentValue
        }) : null
      break;
    case 'SET_LAST_LOGIN_TIME':
      newState.lastLogin = action.payload
      break
    case 'SET_NEW_INFORMATION':
      newState.newInfo = []
      if (action.payload && action.payload.infos && typeof action.payload.infos === 'object') Object.keys(action.payload.infos)
        .sort((a, b) => {
          a = action.payload.infos[a].postedTime
          b = action.payload.infos[b].postedTime
          return a < b ? 1 : a > b ? -1 : 0
        })
        .forEach(key => {
          if (action.payload.infos[key]) newState.newInfo.push(
            Object.assign({ key }, action.payload.infos[key])
          )
        })
      break;
    default:

  }
  return Object.assign({}, state, newState)
}