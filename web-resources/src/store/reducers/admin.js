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
        case 'SUCCESSFUL_USER_SEARCH':
            newState.userSearch = true;
            newState.userList = action.payload.userList
            break;
        case 'FAILED_USER_SEARCH':
            newState.userSearch = false;
            break;
        case 'SUCCESSFUL_CREATOR_SEARCH':
            newState.creatorSearch = true;
            newState.creatorList = action.payload.creatorList
            break;
        case 'FAILED_CREATOR_SEARCH':
            newState.creatorSearch = false;
            break;
        case 'SUCCESSFUL_UPDATE_OTHER_USER':
            newState.updateOtherUser = true;
            break;
        case 'FAILED_UPDATE_OTHER_USER':
            newState.updateOtherUser = false;
            break;
    }
    return Object.assign({}, state, newState)
  }