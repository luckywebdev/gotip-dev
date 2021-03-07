export default {
  gotipShow: (show_state) => {
    console.log("action_show_state", show_state);
    return { type: 'GoTip_SHOW', payload: show_state }
  },
  gotipShowSuccess: (show_state) => {
    return { type: 'GoTip_SHOW_SUCCESS', show_state }
  },
  executeCancelAccount : (uid) => {
    return { type: 'EXECUTE_CANCEL_ACCOUNT', payload: uid }
  },
  changePage : (id, parentID) => {
    return { type: 'CHANGE_PAGE', payload: {id, parentID} }
  },
  executeLogout : () => {
    return { type: 'EXECUTE_LOGOUT', payload: null }
  },
  getAccountInfo: (uid) => {
    return { type: 'GET_ACCOUNT_INFO', payload: uid }
  },
  getCreatorList: () => {
    return { type: 'GET_CREATOR_LIST' }
  },
  getChildAgent: (reqData) => {
    return { type: 'GET_CHILD_AGENT', payload: reqData }
  },
  getOtherAgentAccountInfo: (uid) => {
    return { type: 'GET_OTHER_AGENT_ACCOUNT_INFO', payload: uid }
  },
  getOtherAccountInfo: (uid) => {
    return { type: 'GET_OTHER_ACCOUNT_INFO', payload: uid }
  },
  sendChip: (sendData) => {
    return { type: 'SEND_CHIP', payload: sendData}
  }
}