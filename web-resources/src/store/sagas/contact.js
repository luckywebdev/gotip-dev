import { call, put, fork, take } from 'redux-saga/effects'
import axios from 'axios'
import { alertErrorMessage } from './commonAlert'


export default function* handlePostContactMail () {
  while (true) {
    const action = yield take('CONTACT_SEND_MAIL')

    yield put({ type: 'SET_LOADING_TEXT', payload: 'お問い合わせメッセージ送信中' })
    const { payload, error } = yield call(postMail, action.payload.values)
    yield put({ type: 'SET_LOADING_TEXT', payload: null })
    
    if (!error) {
      if (payload && payload.result === true) {
        yield put({ type: 'CLEAR_CONTACT_VALUES', payload: null })
        window.alert('お問い合わせいただきましてありがとうございます。メッセージの送信が完了いたしました。')
      } else {
        alertErrorMessage(payload.message)
      }
    } else {
      alertErrorMessage(error.errCode)
    }
  }
}

function postMail ({ name, title, message, email}) {
  return new Promise( async (resolve) => {
    try {
      const response = await axios.post('/api/mail/postContactMail', {
        senderName: name,
        senderAddress: email,
        title,
        message
      })
      .catch((err) => {
        console.error(err)
      })
      console.log(response)
      resolve({
        payload: {
          result: response.data.result,
          message: response.data.result ? null : 'お問い合わせメッセージの送信に失敗いたしました。'
        }        
      })
    } catch (err) {
      console.error(err)
      resolve({
        payload: null,
        error: { errCode: '04 Post mail Failed.' }
      })
    }
  })
}