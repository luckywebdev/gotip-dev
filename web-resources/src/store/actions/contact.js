export default {
  changedValues: (name, value) => {
    return { type: 'CONTACT_INPUT', payload: { name: name, value: value } }
  },
  executeSendMail: (state) => {
    return { type: 'CONTACT_SEND_MAIL', payload: { values: state } }
  }
}