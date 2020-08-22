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
  }