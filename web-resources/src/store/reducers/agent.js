const initialState = {
    updateResult: false
  }
  
  export default (state = initialState, action) => {
    let newState = {}
    switch (action.type) {
        case 'APPROVE_SUCCESS':
            newState.updateResult = true;
            break;
    }
    return Object.assign({}, state, newState)
  }