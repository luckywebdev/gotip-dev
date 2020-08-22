const initialState = {
    result: false,
    device_connected: false,
    error: '',
    device_list: []
  }
  
  export default (state = initialState, action) => {
    let newState = {}
    let temp_state = {}
    let device_list_temp = state.device_list;
    let chk = -1;
    switch (action.type) {
      case 'BLE_CONNECT_SUCCESS':
        newState.result = true;
        temp_state.device_name = action.payload.device_name
        temp_state.device_uuid = action.payload.device_uuid
        temp_state.device_connected = true
        if(state.device_list.length > 0){
          chk = device_list_temp.findIndex(item => (item.device_name === action.payload.device_name));
          if(chk === -1){
            device_list_temp.push(temp_state);
          }
          else{
            device_list_temp[chk] = temp_state;
          }
        }
        else{
          device_list_temp.push(temp_state);
        }
        newState.device_list = device_list_temp
        break
      case 'BLE_CONNECT_FAILED':
        newState.result = false
        newState.errMessage = action.payload.errMessage
        break
      case 'BLE_SETTING':
        newState.result = true;
        temp_state.device_connected = true
        Object.assign(temp_state, action.payload);
        if(state.device_list.length > 0){
          chk = device_list_temp.findIndex(item => (item.device_name === action.payload.device_name));
          if(chk === -1){
            device_list_temp.push(temp_state);
          }
          else{
            device_list_temp[chk] = temp_state;
          }
        }
        else{
          device_list_temp.push(temp_state);
        }
        newState.device_list = device_list_temp
        break
      case 'BLE_SETTING_FAILED':
        newState.result = false
        newState.errMessage = action.payload.errMessage
        break
      case 'BLE_REMOVE':
        newState.result = true;
        Object.assign(temp_state, action.payload);
        if(state.device_list.length > 0){
          chk = device_list_temp.findIndex(item => (item.device_name === action.payload.device_name));
          if(chk > -1){
            device_list_temp.splice(chk, 1);
          }
        }
        newState.device_list = device_list_temp
        break
      case 'BLE_REMOVE_FAILED':
        newState.result = false
        newState.errMessage = action.payload.errMessage
        break
      }
    return Object.assign({}, state, newState)
  }