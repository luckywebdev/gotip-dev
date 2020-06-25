import { call, put, fork, take } from 'redux-saga/effects';
import UIkit from 'uikit'
import alertErrorMessage from './commonAlert'
import axios from 'axios'


export default function* handleUserGetAccountInfo (firebase) {
  while (true) {
    const action = yield take('GET_ACCOUNT_INFO')

    const { payload, error } = yield call(getAccountInfo, firebase)
    
    if (!error) {
      yield put({ type: 'SET_ACCOUNT_INFO', payload: payload.account ? payload.account : {} })
      // yield put({ type: 'SET_LAST_LOGIN_TIME', payload: payload.account && payload.account.lastLogin ? payload.account.lastLogin : null })
      // yield put({ type: 'SET_CONFIG', payload: payload.config ? payload.config : {} })
      yield put({ type: 'CHANGE_LOGIN_STATE', payload: { isLogedIn: true, gettingState: true } })
    } else {
      alertErrorMessage(error.errCode)
    }
  }
}

async function getAccountInfo (firebase) {
  return new Promise(async (resolve, reject) => {
    console.log(firebase.auth().currentUser);
    firebase.auth().onAuthStateChanged((user) => {
      firebase.auth().currentUser.getIdToken(true)
      .then((idToken) => {
        axios.post('/api/user/get', { idToken: idToken })
        .then((response) => {
          const data = response.data ? response.data : {}
          if (data.account) data.account.userid = firebase.auth().currentUser.uid
          resolve({
            payload: data
          })
        }).catch((err) => {
          console.error(err)
          resolve({
            error: err.message
          })
        })
      }).catch((err) => {
        resolve({
          error: err.message
        })
      })
    })
  })
}