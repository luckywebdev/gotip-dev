import { call, put, fork, take } from 'redux-saga/effects';
import axios from 'axios'

let firebase;

function* handleGoTipShowSate() {
  while (true) {
    const action = yield take('GoTip_SHOW'); 
    console.log("show_state_action", action);   
    try {
      yield put({ type: 'GoTip_SHOW_SUCCESS', payload: action.payload });
    } catch(err) {
      console.error(err);
    }
  }
}

function* handleCancelAccount() {
  while (true) {
    const action = yield take('EXECUTE_CANCEL_ACCOUNT')
    const { payload, error } = yield call(cancelAccount, firebase, action.payload)
    yield put({ type: 'SET_LOADING_TEXT', payload: 'アカウント削除理中' })
    if (!error) {
      if(payload && payload.result === true){
        yield put({ type: 'SET_LOADING_TEXT', payload: null })
        localStorage.clear();
        window.location.reload()
      }
      else{
        if(payload.error == "auth")
          alertErrorMessage("アカウント削除失敗!")
        else if(payload.error == "db")
          alertErrorMessage("アカウント削除失敗!")
      }
    } else {
      alertErrorMessage(error.errCode)
    }
  }
}

function cancelAccount(firebase, uid){
  return new Promise(async (resolve, reject) => {
    try{
      const response = await axios.get(`/api/user/delete/${uid}`);
      const data = response.data ? response.data : {}
      resolve({
        payload: data,
        error: null
      })
    }
    catch(err) {
      reject({
        payload: null,
        error: err
      })
    }
  })
}

export default function* (firebaseRef) {
  firebase = firebaseRef
  yield fork(handleGoTipShowSate)
  yield fork(handleCancelAccount)
}