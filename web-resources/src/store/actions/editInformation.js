export default {
  executeRefreshInfo: ({uid}) => {
    return {type: 'REFRESH_NEW_INFORMATION', payload: uid}
  },
  executePost: (values) => {
    return { type: 'POST_NEW_INFORMATION', payload: values}
  },
  executeGetPostedInfo: (key) => {
    return { type: 'GET_POSTED_INFORMATION', payload: { key }}
  },
  executeDelete: (key) => {
    return { type: 'DELETE_NEW_INFORMATION', payload: { key } }
  }
}