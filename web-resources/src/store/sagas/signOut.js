import { call, put, fork, take } from 'redux-saga/effects'
import { alertErrorMessage } from './commonAlert'


export default function* handleSignOut (firebase) {
  while (true) {
    const action = yield take('EXECUTE_LOGOUT')
    yield put({ type: 'SET_LOADING_TEXT', payload: 'ログアウト処理中' })
    const { error } = yield call(signOut, firebase)
    if (!error) {
      localStorage.clear();
      window.location.reload()
    } else {
      alertErrorMessage(error.errCode)
    }
  }
}

function signOut (firebase) {
  return new Promise((resolve) => {
    try {
      firebase.auth().signOut()
      .then((result) => {
        resolve({})
      })
      .catch(err => {
        resolve({
          error: err.code
        })
      })
    } catch (err) {
      console.error('Crashed at logout.', err)
      resolve({
        error: { errCode: '03 Logout Failed.' }
      })
    }
  })
}