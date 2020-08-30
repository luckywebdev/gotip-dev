export default {
    tryApprove: (agentData) => {
      console.log("TRY_APPROVE", agentData);
      return { type: 'TRY_APPROVE', payload: agentData }
    },
    trySearch: (fiterOptions) => {
      console.log("TRY_SEARCH", fiterOptions);
      return { type: 'TRY_SEARCH', payload: fiterOptions }
    },
    tryCheckAgent: () => {
      return { type: 'TRY_CHECK_AGENT' }
    },
    sendMessage: (messageContent) => {
      console.log("SEND_MESSAGE", messageContent);
      return { type: 'SEND_MESSAGE', payload: messageContent }
    },
  }