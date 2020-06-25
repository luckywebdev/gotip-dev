export default {
  gotipShow: (show_state) => {
    console.log("action_show_state", show_state);
    return { type: 'GoTip_SHOW', payload: show_state }
  },
  gotipShowSuccess: (show_state) => {
    return { type: 'GoTip_SHOW_SUCCESS', show_state }
  },
  executeLogout : () => {
    return { type: 'EXECUTE_LOGOUT', payload: null }
  },
  getAccountInfo: (uid) => {
    return { type: 'GET_ACCOUNT_INFO', payload: uid }
  }

}