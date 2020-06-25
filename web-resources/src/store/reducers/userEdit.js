const initialState = {
    editResult: false
  }
  
  export default (state = initialState, action) => {
    let newState = {}
    switch (action.type) {
      case 'UPDATE_PERSONAL_INFO_SUCCESS':
        newState.editResult = true;
        break;
      case 'UPDATE_PERSONAL_INFO_FAILED':
        newState.editResult = false;
        break;
      case 'CHANGE_STATE_SUCCESS':
        newState.editResult = false;
        break;
      case 'UPLOAD_IMAGE_SUCCESS':
        newState.editResult = true;
        newState.uploadedUrl = action.payload.uploadedUrl;
        break;
      case 'UPLOAD_IMAGE_FAILED':
        newState.editResult = false;
        break;
      }
    return Object.assign({}, state, newState)
  }