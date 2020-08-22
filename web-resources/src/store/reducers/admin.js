const initialState = {
    noticeData: [],
    noticeResult: null
  }
  
  export default (state = initialState, action) => {
    let newState = {}
    switch (action.type) {
        case 'SUCCESSFUL_CREATE_NOTICE':
            newState.noticeResult = true;
            break;
        case 'FAILED_UPDATE_NOTICE':
            newState.noticeResult = false;
            break;
        case 'SUCCESSFUL_CREATE_NOTICE':
            newState.noticeResult = true;
            break;
        case 'FAILED_UPDATE_NOTICE':
            newState.noticeResult = false;
            break;
        case 'SUCCESSFUL_GET_NOTICE':
            newState.noticeResult = true;
            newState.noticeData = action.payload.noticeData
            break;
        case 'FAILED_GET_NOTICE':
            newState.noticeResult = false;
            break;
    }
    return Object.assign({}, state, newState)
  }