const initialState = {
  title: 'ログインに関して'
}

export default (state = initialState, action) => {
  let newState = {}
  switch (action.type) {
    case 'CONTACT_INPUT':
      if (action.payload.name && typeof action.payload.value !== 'undefined')
      newState[action.payload.name] = action.payload.value
      break
    case 'CLEAR_CONTACT_VALUES':
      newState.name = ''
      newState.title = 'ログインに関して'
      newState.email = ''
      newState.message = ''
      break
    default:
  }
  return Object.assign({}, state, newState)
}