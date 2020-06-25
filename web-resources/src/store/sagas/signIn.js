import { call, put, fork, take } from 'redux-saga/effects'
import alertErrorMessage from './commonAlert'
// import alertErrorMessage from './commonAlert'


function* handleUserSignIn () {
  while (true) {
    const action = yield take('TRY_LOGIN')

    const { payload, error } = yield call(signIn, firebase, action.payload)
    
    if (!error) {
      if (payload && payload.result === true) {
        yield put({ type: 'SUCCESSFUL_LOGIN', payload: payload })
      } else {
        yield put({ type: 'FAILED_LOGIN', payload: payload });
        alertErrorMessage(payload.errMessage);
      }
    } else {
      console.log("errorCode", error.errCode);
      alertErrorMessage(error.errCode);
    }
  }
}
function signIn (firebase, userInfo) {
  const PERSISTANCE_SESSION = firebase.auth.Auth.Persistence.SESSION
  const PERSISTANCE_LOCAL = firebase.auth.Auth.Persistence.LOCAL
  // console.log("userInfo", userInfo);

  return new Promise((resolve) => {
    try {
      firebase.auth().setPersistence(userInfo.isKeepLogin ? PERSISTANCE_LOCAL : PERSISTANCE_SESSION)
      .then(() => {
        firebase.auth().signInWithEmailAndPassword(userInfo.email, userInfo.password)
          .then((response) => {
            // console.log('AUTH', response);
            return {
              payload: {
                result: true,
                uid: response.user.uid,
                isVerified: response.user.emailVerified
              },
              error: null
            }
          }).catch((err) => {
            let errMessage = ''
            switch (err.code) {
              case "auth/invalid-email":
                errMessage = 'メールアドレスの形式が正しくありません。'
                break
              default :
                errMessage = 'ログインできませんでした。'
            }
            // console.log("errMessage", errMessage);
            return {
              payload: { result: false, errMessage: errMessage},
              error: null
            }
          }).then(async (result) => {
            resolve(result)
          })
      })
    } catch (err) {
      console.error('Crashed at login.', err)
      resolve({
        payload: null,
        error: { errCode: '01 Login Failed.' }
      })
    }
  })
}

function* handleSendRequest () {
  while (true) {
    const action = yield take('TRY_SEND_REQUEST')

    const { payload, error } = yield call(sendRequest, firebase, action.payload)
    
    if (!error) {
      if (payload && payload.result === true) {
        yield put({ type: 'SUCCESSFUL_REQUEST', payload: payload })
      } else {
        yield put({ type: 'FAILED_REQUEST', payload: payload });
        alertErrorMessage(payload.errMessage);
      }
    } else {
      console.log("errorCode", error.errCode);
      alertErrorMessage(error.errCode);
    }
  }
}

function sendRequest (firebase, userInfo) {
  return new Promise((resolve) => {
    try {
      firebase.auth().sendPasswordResetEmail(userInfo.email)
      .then(() => {
        return {
          payload: {
            result: true,
          },
          error: null
        }
      }).catch((err) => {
        let errMessage = ''
        console.log("error_code", err.code);
        errMessage = 'パスワードのリセット要求は失敗しました。'
        // console.log("errMessage", errMessage);
        return {
          payload: { result: false, errMessage: errMessage},
          error: null
        }
      }).then(async (result) => {
        resolve(result)
      })
    } catch (err) {
      console.error('Crashed at ResetPassword Request.', err)
      resolve({
        payload: null,
        error: { errCode: '05 ResetPassword Failed.' }
      })
    }
  })
}

function* handleGoogleLogin () {
  while (true) {
    const action = yield take('TRY_GOOGLE_LOGIN')

    const { payload, error } = yield call(googleLogin, firebase)
    
    if (!error) {
      if (payload && payload.result === true) {
        yield put({ type: 'SUCCESSFUL_LOGIN', payload: payload })
      } else {
        yield put({ type: 'FAILED_LOGIN', payload: payload });
        alertErrorMessage(payload.errMessage);
      }
    } else {
      console.log("errorCode", error.errCode);
      alertErrorMessage(error.errCode);
    }
  }
}

function googleLogin(firebase) {
  const provider = new firebase.auth.GoogleAuthProvider();
  return new Promise((resolve) => {
    try {
      firebase.auth().signInWithPopup(provider).
      then(() => {
        return {
          payload: {
            result: true,
          },
          error: null
        }
      }).catch((err) => {
        let errMessage = ''
        console.log("error_code", err.code);
        errMessage = 'Googleにログインできませんでした'
        // console.log("errMessage", errMessage);
        return {
          payload: { result: false, errMessage: errMessage},
          error: null
        }
      }).then(async (result) => {
        resolve(result)
      })
    } catch (err) {
      console.error('Crashed at ResetPassword Request.', err)
      resolve({
        payload: null,
        error: { errCode: '05 ResetPassword Failed.' }
      })
    }
  })

}

function* handleFacebookLogin () {
  while (true) {
    const action = yield take('TRY_FACEBOOK_LOGIN')

    const { payload, error } = yield call(facebookLogin, firebase)
    
    if (!error) {
      if (payload && payload.result === true) {
        yield put({ type: 'SUCCESSFUL_LOGIN', payload: payload })
      } else {
        yield put({ type: 'FAILED_LOGIN', payload: payload });
        alertErrorMessage(payload.errMessage);
      }
    } else {
      console.log("errorCode", error.errCode);
      alertErrorMessage(error.errCode);
    }
  }
}

function facebookLogin(firebase) {
  const provider = new firebase.auth.FacebookAuthProvider();
  return new Promise((resolve) => {
    try {
      firebase.auth().signInWithPopup(provider).
      then(() => {
        return {
          payload: {
            result: true,
          },
          error: null
        }
      }).catch((err) => {
        let errMessage = ''
        console.log("error_code", err.code);
        errMessage = 'Facebookにログインできませんでした'
        // console.log("errMessage", errMessage);
        return {
          payload: { result: false, errMessage: errMessage},
          error: null
        }
      }).then(async (result) => {
        resolve(result)
      })
    } catch (err) {
      console.error('Crashed at ResetPassword Request.', err)
      resolve({
        payload: null,
        error: { errCode: '05 ResetPassword Failed.' }
      })
    }
  })

}

let firebase;
export default function* (firebaseRef) {
  firebase = firebaseRef
  yield fork(handleUserSignIn)
  yield fork(handleSendRequest)
  yield fork(handleGoogleLogin)
  yield fork(handleFacebookLogin)
}