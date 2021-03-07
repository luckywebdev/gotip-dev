export default {
    tryCreateNotice: (noticeData) => {
      console.log("CREATE_NOTICE", noticeData);
      return { type: 'CREATE_NOTICE', payload: noticeData }
    },
    tryUpdateNotice: (noticeData) => {
      console.log("UPDATE_NOTICE", noticeData);
      return { type: 'UPDATE_NOTICE', payload: noticeData }
    },
    tryGetNotice: () => {
      return { type: 'GET_NOTICE'}
    },
    tryUserSearch: (filterData) => {
      return { type: 'USER_SEARCH', payload: filterData}
    },
    tryUserDelete: (uidArray, filterData) => {
      return { type: 'USER_DELETE', payload: {uidArray, filterData}}
    },
    tryCreatorSearch: (agentID) => {
      return { type: 'CREATOR_SEARCH', payload: agentID}
    },
    updateOtherUser: (userData) => {
      return { type: 'UPDATE_OTHER_USER', payload: userData}
    },
  }