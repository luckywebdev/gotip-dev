export default {
  trySignUp: (email, password, agent_id = null) => {
    return { type: 'TRY_SIGNUP', payload: { email, password, agent_id }}
  },
  checkUser: (uid, createTime) => {
    return { type: 'CHECK_USER', payload: { uid: uid, createTime: createTime }}
  },
  tryGoogleSignup: (agent_id) => {
    return { type: 'TRY_GOOGLE_SIGNUP', payload: { agent_id} }
  },
  tryFacebookSignup: (agent_id) => {
    return { type: 'TRY_FACEBOOK_SIGNUP', payload: { agent_id } }
  },
  tryTwitterSignup: (agent_id) => {
    return { type: 'TRY_TWITTER_SIGNUP', payload: { agent_id } }
  },
  executeRegister: (state) => {
    return { type: 'REGISTER_USER', payload: { data: state ? state : {} }}
  },
  excuteGetAddress: (postal_code) => {
    return { type: 'GET_ADDRESS', payload: {postalCode: postal_code} }
  },
  excuteGetAddressResultInit: () => {
    return { type: 'GET_ADDRESS_RESULT_INIT' }
  },
  handleRegData: (state) => {
    if(state.step !== "5"){
      return { type: 'HANDLE_REG_DATA', payload: { data: state ? state : {} }}
    }
    else{
      return { type: 'REGISTER_USER', payload: { data: state ? state : {} }}
    }
  },
  tryRegisterAgent: (state) => {
    return { type: 'REGISTER_AGENT', payload: { data: state ? state : {} }}
  }

}