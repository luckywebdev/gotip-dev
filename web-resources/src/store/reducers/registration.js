const initialState = {
  birthdate: {year: "", month: "", day: ""},
  step: "0",
  result: false,
  all_register: false
}

export default (state = initialState, action) => {
  let newState = {}
  switch (action.type) {
    case 'REGISTRATION_INPUT':
      Object.assign({}, newState, action.payload);
      break;
    case 'SUCCESSFUL_CHECK':
      newState.result = true
      newState.email = action.payload.email
      break
    case 'FAILED_CHECK':
      newState.result = false
      newState.errMessage = action.payload.errMessage
      break
    case 'CHECKED_UID':
      newState.isUidAvailable = action.payload.isAvailable
      break 
    case 'SUCCESSFUL_REGISTER_ALL':
      newState.all_register = true
      break
    case 'SUCCESSFUL_REGISTER':
      newState.result = true
      break
    case 'FAILED_REGISTER':
      newState.result = false
      newState.all_register = false
      newState.errMessage = action.payload.errMessage
      break
    case 'SET_ACCOUNT_INFO':
      const userInfo = {}
      userInfo.step = "0";
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
      if (!userInfo.birthdate) userInfo.birthdate = {year: "", month: "", day: ""}
      return userInfo
    case 'HANDLE_REG_DATA':
      newState = { ...action.payload.data };
      break;
    case 'SUCCESSFUL_GET_ADDRESS':
      newState = {
        prefecture: action.payload.prefecture,
        county: action.payload.city,
        town: action.payload.town,
        get_address_result: true
      };
      break;
    case 'FAILED_GET_ADDRESS':
      newState = {
        get_address_result: false,
        prefecture: "",
        county: "",
        town: "",
      };
      break;
    case 'GET_ADDRESS_RESULT_INIT':
      newState = {
        get_address_result: null
      }
  }
  return Object.assign({}, state, newState)
}