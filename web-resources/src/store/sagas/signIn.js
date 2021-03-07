import { call, put, fork, take } from 'redux-saga/effects'
import axios from 'axios'
import { alertErrorMessage } from './commonAlert'
// import alertErrorMessage from './commonAlert'

let firebase;

function* handleUserSignIn () {
  while (true) {
    const action = yield take('TRY_LOGIN')
    const { payload, error } = yield call(signIn, firebase, action.payload)
    if (!error) {
      if (payload && payload.result === true) {
        yield put({ type: 'SUCCESSFUL_LOGIN', payload: payload })
      } else {

        yield put({ type: 'FAILED_LOGIN', payload: payload });
        if(typeof payload.errMessage !== 'undefined'){
          alertErrorMessage(payload.errMessage);
        }
        if(payload.action === "register"){
          console.log("payload=", payload);
          if(payload.agent_id !== undefined && payload.agent_id !== '' && payload.agent_id !== null){
            window.location.href = "./registration?code=" + payload.uid + "&agent=" + payload.agent_id;
          }
          else{
            window.location.href = "./registration?code=" + payload.uid;
          }
        }
        else if(payload.action === "land"){
          window.location.href = "./signup";
        }
        else{
          window.location.href = "./land";
        }
      }
    } else {
      console.log("errorCode", error.errCode);
      if(typeof payload.errCode !== 'undefined')
        alertErrorMessage(error.errCode);
    }
  }
}
function signIn (firebase, userInfo) {
  const PERSISTANCE_SESSION = firebase.auth.Auth.Persistence.SESSION
  const PERSISTANCE_LOCAL = firebase.auth.Auth.Persistence.LOCAL
  return new Promise((resolve) => {
    try {
      firebase.auth().setPersistence(userInfo.isKeepLogin ? PERSISTANCE_LOCAL : PERSISTANCE_SESSION)
      .then(() => {
        firebase.auth().signInWithEmailAndPassword(userInfo.email, userInfo.password)
          .then(async (response) => {
            const res = await axios.post('/api/user/check', {uid: response.user.uid})
            .catch((err) => {
              console.error(err)
            })
            if(res.data.result === true && res.data.action === "login"){
              localStorage.setItem('uid', response.user.uid);
              localStorage.setItem('isLoggedin', true);
              localStorage.setItem('email', response.user.email);
              localStorage.setItem('authLevel', res.data.auth_level);
              return {
                payload: {
                  result: true,
                  uid: response.user.uid,
                  isVerified: response.user.emailVerified,
                  auth_level: res.data.auth_level,
                },
                error: null
              }
            }
            else if(res.data.action === "register"){
              return {
                payload: {
                  result: false,
                  action: "register",
                  uid: response.user.uid,
                  isVerified: response.user.emailVerified,
                  agent_id: res.data.agent_id
                },
                error: null
              }
            }
            else if(res.data.result === false && res.data.action === "land"){
              return {
                payload: {
                  result: false,
                  action: "land",
                  uid: response.user.uid,
                  isVerified: response.user.emailVerified
                },
                error: null
              }
            }
            // console.log('AUTH', response);
          }).catch((err) => {
            let errMessage = ''
            switch (err.code) {
              case "auth/invalid-email":
                errMessage = 'メールアドレスの形式が正しくありません。'
                break
              default :
                errMessage = 'ログインできませんでした。'
            }
            console.log("errMessage", err.code);
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
        error: { errCode: '10 Login Failed.' }
      })
    }
  })
}

function* handleUserSignInByToken () {
  while (true) {
    const action = yield take('TRY_LOGIN_BY_TOKEN')
    const { payload, error } = yield call(signInbyToken, firebase, action.payload)
    if (!error) {
      if (payload && payload.result === true) {
        yield put({ type: 'SUCCESSFUL_LOGIN', payload: payload })
        yield put({ type: 'CHANGE_LOGIN_STATE', payload: { isLogedIn: true, gettingState: true } })
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
function signInbyToken (firebase, userInfo) {
  return new Promise((resolve) => {
    try {
      firebase.auth().signInWithCustomToken(userInfo.customToken)
      .then((response) => {
        localStorage.setItem('uid', response.user.uid);
        localStorage.setItem('isLoggedin', true);
        localStorage.setItem('check', false);
        localStorage.setItem('email', response.user.email);
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
          case "auth/invalid-token":
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
  } catch (err) {
      console.error('Crashed at login.', err)
      resolve({
        payload: null,
        error: { errCode: '11 Login Failed.' }
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
        if(typeof payload.errMessage !== 'undefined'){
          alertErrorMessage(payload.errMessage);
        }
        if(payload.action === "register"){
          if(payload.agent_id !== undefined && payload.agent_id !== '' && payload.agent_id !== null){
            window.location.href = "./registration?code=" + payload.uid + "&agent=" + payload.agent_id;
          }
          else{
            window.location.href = "./registration?code=" + payload.uid;
          }
        }
        else if(payload.action === "land"){
          window.location.href = "./signup";
        }
        else{
          window.location.href = "./land";
        }
      }

    } else {
      console.log("errorCode", error.errCode);
      if(typeof payload.errCode !== 'undefined')
        alertErrorMessage(error.errCode);
    }
  }
}

function googleLogin(firebase) {
  const provider = new firebase.auth.GoogleAuthProvider();
  return new Promise((resolve) => {
    try {
      firebase.auth().signInWithPopup(provider).
      then(async (response) => {
        const res = await axios.post('/api/user/check', {uid: response.user.uid})
        .catch((err) => {
          console.error(err)
        })
        if(res.data.result === true && res.data.action === "login"){
          localStorage.setItem('uid', response.user.uid);
          localStorage.setItem('isLoggedin', true);
          localStorage.setItem('email', response.user.email);
          localStorage.setItem('authLevel', res.data.auth_level);
          return {
            payload: {
              result: true,
              uid: response.user.uid,
              isVerified: response.user.emailVerified,
              auth_level: res.data.auth_level
            },
            error: null
          }
        }
        else if(res.data.action === "register"){
          return {
            payload: {
              result: false,
              action: "register",
              uid: response.user.uid,
              isVerified: response.user.emailVerified,
              agent_id: res.data.agent_id
            },
            error: null
          }
        }
        else if(res.data.result === false && res.data.action === "land"){
          return {
            payload: {
              result: false,
              action: "land",
              uid: response.user.uid,
              isVerified: response.user.emailVerified
            },
            error: null
          }
        }
      }).catch((err) => {
        let errMessage = ''
        console.log("error_code", err.code);
        switch(err.code){
          case "auth/account-exists-with-different-credential":
            errMessage = 'Googleにログインできませんでした。メールは既に使用されています。';
            break;
          default:
            errMessage = 'Googleにログインできませんでした。';
        }
        // console.log("errMessage", errMessage);
        return {
          payload: { result: false, errMessage: errMessage},
          error: null
        }
      }).then((result) => {
        console.log("social_result", result);
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
        if(typeof payload.errMessage !== 'undefined'){
          alertErrorMessage(payload.errMessage);
        }
        if(payload.action === "register"){
          window.location.href = "./registration?code=" + payload.uid;
        }
        else if(payload.action === "land"){
          window.location.href = "./signup";
        }
        else{
          window.location.href = "./land";
        }
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
      then(async (response) => {
        const res = await axios.post('/api/user/check', {uid: response.user.uid})
        .catch((err) => {
          console.error(err)
        })
        if(res.data.result === true && res.data.action === "login"){
          localStorage.setItem('uid', response.user.uid);
          localStorage.setItem('isLoggedin', true);
          localStorage.setItem('email', response.user.email);
          localStorage.setItem('authLevel', res.data.auth_level);
          return {
            payload: {
              result: true,
              uid: response.user.uid,
              isVerified: response.user.emailVerified,
              auth_level: res.data.auth_level
            },
            error: null
          }
        }
        else if(res.data.action === "register"){
          return {
            payload: {
              result: false,
              action: "register",
              uid: response.user.uid,
              isVerified: response.user.emailVerified,
              agent_id: res.data.agent_id
            },
            error: null
          }
        }
        else if(res.data.result === false && res.data.action === "land"){
          return {
            payload: {
              result: false,
              action: "land",
              uid: response.user.uid,
              isVerified: response.user.emailVerified
            },
            error: null
          }
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
        console.log("facebook_result", result);
        resolve(result)
      })
    } catch (err) {
      console.error('Crashed at ResetPassword Request.', err)
      resolve({
        payload: null,
        error: { errCode: '06 ResetPassword Failed.' }
      })
    }
  })

}

function* handleTwitterLogin () {
  while (true) {
    const action = yield take('TRY_TWITTER_LOGIN')
    const { payload, error } = yield call(twitterLogin, firebase)
    if (!error) {
      if (payload && payload.result === true) {
        yield put({ type: 'SUCCESSFUL_LOGIN', payload: payload })
      } else {
        yield put({ type: 'FAILED_LOGIN', payload: payload });
        if(typeof payload.errMessage !== 'undefined'){
          alertErrorMessage(payload.errMessage);
        }
        if(payload.action === "register"){
          window.location.href = "./registration?code=" + payload.uid;
        }
        else if(payload.action === "land"){
          window.location.href = "./signup";
        }
        else{
          window.location.href = "./land";
        }
      }
    } else {
      console.log("errorCode", error.errCode);
      alertErrorMessage(error.errCode);
    }
  }
}

function twitterLogin(firebase) {
  const provider = new firebase.auth.TwitterAuthProvider();
  return new Promise((resolve) => {
    try {
      firebase.auth().signInWithPopup(provider).
      then(async (response) => {
        const res = await axios.post('/api/user/check', {uid: response.user.uid})
        .catch((err) => {
          console.error(err)
        })
        if(res.data.result === true && res.data.action === "login"){
          localStorage.setItem('uid', response.user.uid);
          localStorage.setItem('isLoggedin', true);
          localStorage.setItem('email', response.user.email);
          localStorage.setItem('authLevel', res.data.auth_level);
          return {
            payload: {
              result: true,
              uid: response.user.uid,
              isVerified: response.user.emailVerified,
              auth_level: res.data.auth_level
            },
            error: null
          }
        }
        else if(res.data.action === "register"){
          return {
            payload: {
              result: false,
              action: "register",
              uid: response.user.uid,
              isVerified: response.user.emailVerified,
              agent_id: res.data.agent_id
            },
            error: null
          }
        }
        else if(res.data.result === false && res.data.action === "land"){
          return {
            payload: {
              result: false,
              action: "land",
              uid: response.user.uid,
              isVerified: response.user.emailVerified
            },
            error: null
          }
        }
      }).catch((err) => {
        let errMessage = ''
        console.log("error_code", err.code);
        switch(err.code){
          case "auth/account-exists-with-different-credential":
            errMessage = 'Twitterにログインできませんでした。メールは既に使用されています。';
            break;
          default:
            errMessage = 'Twitterにログインできませんでした。';
        }
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
        error: { errCode: '07 ResetPassword Failed.' }
      })
    }
  })

}

export default function* (firebaseRef) {
  firebase = firebaseRef
  yield fork(handleUserSignIn)
  yield fork(handleUserSignInByToken)
  yield fork(handleSendRequest)
  yield fork(handleGoogleLogin)
  yield fork(handleFacebookLogin)
  yield fork(handleTwitterLogin)
}