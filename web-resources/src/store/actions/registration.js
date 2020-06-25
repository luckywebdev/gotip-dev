export default {
  checkUserId: (userId) => {
    return { type: 'CHECK_UID', payload: { uid: userId, isProfile: false }}
  },
  executeRegister: (state, isNewRegistration) => {
    return { type: 'REGISTER_USER', payload: { data: state ? state : {}, isNew: isNewRegistration }}
  }
}