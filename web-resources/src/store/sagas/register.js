import { call, put, fork, take } from 'redux-saga/effects';
import axios from 'axios';
import * as Constants from '../../Constants';
import { alertErrorMessage, alertAccountSuccessMessage } from './commonAlert';

let firebase;
function* handleUserSignUp () {
  while (true) {
    const action = yield take('TRY_SIGNUP');

    yield put({ type: 'SET_LOADING_TEXT', payload: '登録処理中' });
    const { payload, error } = yield call(signup, firebase, action.payload)
      // : yield call(modify, action.payload.data, firebase)
    yield put({ type: 'SET_LOADING_TEXT', payload: null })
    
    if (!error) {
      if (payload && payload.result === true) {
        yield put({ type: 'SUCCESSFUL_REGISTER', payload: payload })
      } else {
        yield put({ type: 'FAILED_REGISTER', payload: payload })
        // alertErrorMessage(payload.errMessage)
      }
    } else {
      yield put({ type: 'FAILED_REGISTER', payload: {errMessage: error.errCode} })
      // alertErrorMessage(error.errCode)
    }
  }
}

function signup(firebase, userData) {
  return new Promise( async (resolve) => {
    try {
      console.log("userData===>", userData);
      const response = await axios.post('/api/user/create', userData)
        .catch((err) => {
          console.error(err)
        })
      console.log(response)
      resolve({
        payload: {
          result: response.data.result,
          email: userData.email,
          password: userData.password,
          errMessage: response.data.message
        }
      })
    } catch (err) {
      console.error('Crashed at register.', err)
      resolve({
        payload: null,
        error: { errCode: '01 Register Failed.' }
      })
    }
  })
}

function* handleGoogleSignup () {
  while (true) {
    const action = yield take('TRY_GOOGLE_SIGNUP')
    yield put({ type: 'SET_LOADING_TEXT', payload: '登録処理中' });
    const { payload, error } = yield call(googleSignup, firebase, action.payload)
    yield put({ type: 'SET_LOADING_TEXT', payload: null })
    if (!error) {
      if (payload && payload.result === true) {
        yield put({ type: 'SUCCESSFUL_REGISTER', payload: payload })
      } else {
        yield put({ type: 'FAILED_REGISTER', payload: payload })
      }
    } else {
      yield put({ type: 'FAILED_REGISTER', payload: {errMessage: error.errCode} })
    }
  }
}

function googleSignup(firebase, param) {
  const provider = new firebase.auth.GoogleAuthProvider();
  return new Promise((resolve) => {
    console.log("google_signup===>", param);
    try {
      firebase.auth().signInWithPopup(provider).
      then(async (response) => {
        const api_result = await axios.post('/api/user/createbysocial', {uid: response.user.uid, email: response.user.email, agent_id: param.agent_id})
          .catch((err) => {
            console.error(err)
          })
          console.log("api_result", api_result)
          return {
            payload: {
              result: api_result.data.result,
              uid: response.user.uid,
              isVerified: response.user.emailVerified
          },
            error: null
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
function* handleFacebookSignup () {
  while (true) {
    const action = yield take('TRY_FACEBOOK_SIGNUP')
    yield put({ type: 'SET_LOADING_TEXT', payload: '登録処理中' });
    const { payload, error } = yield call(facebookSignup, firebase, action.payload)
    yield put({ type: 'SET_LOADING_TEXT', payload: null })
    if (!error) {
      if (payload && payload.result === true) {
        yield put({ type: 'SUCCESSFUL_REGISTER', payload: payload })
      } else {
        yield put({ type: 'FAILED_REGISTER', payload: payload })
      }
    } else {
      yield put({ type: 'FAILED_REGISTER', payload: {errMessage: error.errCode} })
    }
  }
}

function facebookSignup(firebase, param) {
  const provider = new firebase.auth.FacebookAuthProvider();
  return new Promise((resolve) => {
    try {
      firebase.auth().signInWithPopup(provider).
      then(async (response) => {
        const api_result = await axios.post('/api/user/createbysocial', {uid: response.user.uid, email: response.user.email, agent_id: param.agent_id})
          .catch((err) => {
            console.error(err)
          })
          return {
            payload: {
              result: api_result.data.result,
              uid: response.user.uid,
              isVerified: response.user.emailVerified
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
      }).then((result) => {
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
function* handleTwitterSignup () {
  while (true) {
    const action = yield take('TRY_TWITTER_SIGNUP')
    yield put({ type: 'SET_LOADING_TEXT', payload: '登録処理中' });
    const { payload, error } = yield call(twitterSignup, firebase, action.payload)
    yield put({ type: 'SET_LOADING_TEXT', payload: null })
    if (!error) {
      if (payload && payload.result === true) {
        yield put({ type: 'SUCCESSFUL_REGISTER', payload: payload })
      } else {
        yield put({ type: 'FAILED_REGISTER', payload: payload })
      }
    } else {
      yield put({ type: 'FAILED_REGISTER', payload: {errMessage: error.errCode} })
    }
  }
}

function twitterSignup(firebase, param) {
  const provider = new firebase.auth.GoogleAuthProvider();
  return new Promise((resolve) => {
    try {
      firebase.auth().signInWithPopup(provider).
      then(async (response) => {
        const api_result = await axios.post('/api/user/createbysocial', {uid: response.user.uid, email: response.user.email, agent_id: param.agent_id})
          .catch((err) => {
            console.error(err)
          })
          return {
            payload: {
              result: api_result.data.result,
              uid: response.user.uid,
              isVerified: response.user.emailVerified
          },
            error: null
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
      }).then((result) => {
        console.log("social_result", result);
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


function* handleCheckUser () {
  while(true) {
    const action = yield take('CHECK_USER');
    const { payload, error } = yield call(checkUser, firebase, action.payload);
    if(!error){
      if(payload && payload.result === true && payload.actions === "register") {
        yield put({ type: 'SUCCESSFUL_CHECK', payload: payload });
        yield put({ type: 'TRY_LOGIN_BY_TOKEN', payload: {
          customToken: payload.customToken,
        } })
      }
      else {
        yield put({ type: 'FAILED_CHECK', payload: payload })
        if(typeof payload.errMessage !== 'undefined')
          alertErrorMessage(payload.errMessage);
        if(payload.errMessage === 'timeout'){
          window.location.href = "./signup";
        }
        else{
          // window.location.href = "./land";
        }
      }
    }
    else {
      if(typeof payload.errCode !== 'undefined')
        alertErrorMessage(error.errCode)
    }
  }
}

function checkUser(firebase, userData) {
  return new Promise( async (resolve) => {
    try {
      const response = await axios.post('/api/user/check', userData)
        .catch((err) => {
          console.error(err)
        })
      resolve({
        payload: {
          result: response.data.result,
          actions: response.data.action,
          customToken: response.data.customToken,
          email: response.data.email,
          errMessage: response.data.message
        }
      })
    } catch (err) {
      console.error('Crashed at Checking.', err)
      resolve({
        payload: null,
        error: { errCode: '02 Account Checking Failed.' }
      })
    }
  })
}

function* handleRegisterUser () {
  while (true) {
    const action = yield take('REGISTER_USER');
    yield put({ type: 'SET_LOADING_TEXT', payload: '登録処理中' });
    const { payload, error } = action.payload.data.regType === "fan" ? yield call(registerFan, firebase, action.payload.data) : yield call(register, firebase, action.payload.data)
      // : yield call(modify, action.payload.data, firebase)
    yield put({ type: 'SET_LOADING_TEXT', payload: null })
    if (!error) {
      if (payload && payload.result === true) {
        yield put({ type: 'SUCCESSFUL_REGISTER_ALL', payload: payload })
      } else {
        yield put({ type: 'FAILED_REGISTER', payload: payload })
        if(typeof payload.errMessage !== 'undefined')
          alertErrorMessage(payload.errMessage)
      }
    } else {
      if(typeof payload.errCode !== 'undefined')
        alertErrorMessage(error.errCode)
    }
  }
}

function register (firebase, userData) {
  return new Promise( async (resolve) => {
    try {
      const storageRef = firebase.storage().ref();
      const mainFile = storageRef.child(`image/${(new Date().getTime() / 1000)}_${userData.fileContent.name}`);
      mainFile.put(userData.fileContent).then((snapshot) => {
        mainFile.getDownloadURL().then(async (url) => {
          let tel = userData.tel ? userData.tel.replace(/[^0-9]/g, '') : null
          if (tel && tel.length === 11) params.set('tel', tel)
          userData.delegate.ID_photo = url;
          userData.uid = firebase.auth().currentUser.uid;
          const response = await axios.post('/api/user/register', userData)
            .catch((err) => {
              console.error(err)
            })
          console.log(response)
          resolve({
            payload: {
              result: response.data.result,
              errMessage: response.data.message
            }
          })
        })
      })
    } catch (err) {
      console.error('Crashed at register.', err)
      resolve({
        payload: null,
        error: { errCode: '03 Register Failed.' }
      })
    }
  })
}
function registerFan (firebase, userData) {
  return new Promise( async (resolve) => {
    try {
      userData.uid = firebase.auth().currentUser.uid;
      const response = await axios.post('/api/user/register', userData)
        .catch((err) => {
          console.error(err)
        })
      console.log(response)
      resolve({
        payload: {
          result: response.data.result,
          errMessage: response.data.message
        }
      })
    } catch (err) {
      console.error('Crashed at register.', err)
      resolve({
        payload: null,
        error: { errCode: '03 Register Failed.' }
      })
    }
  })
}

function modify (userData, firebase) {
  return new Promise( async (resolve) => {
    try {
      firebase.auth().currentUser.getIdToken(true)
      .then(async (idToken) => {
        const params = new URLSearchParams()
        params.append('idToken', idToken)
        params.append('email', userData.email)
        params.append('password', userData.password)
        params.append('name', userData.name)
        params.append('ruby', userData.ruby)
        params.append('nickname', userData.nickname)
        params.append('sex', userData.sex)
        params.append('birthyear', userData.birthdate.year)
        params.append('birthmonth', userData.birthdate.month)
        params.append('birthday', userData.birthdate.day)
        let tel = userData.tel ? userData.tel.replace(/[^0-9]/g, '') : null
        if (tel && tel.length === 11) params.append('tel', tel)
        const response = await axios.post('/api/user/modify', params)
          .catch((err) => {
            console.error(err)
          })
        console.log(response, userData)
        resolve({
          payload: {
            result: response.data.result,
            email: userData.email,
            password: userData.password,
            errMessage: response.data.message
          }
        })
      })
    } catch (err) {
      console.error('Crashed at register.', err)
      resolve({
        payload: null,
        error: { errCode: '02 Register Failed.' }
      })
    }
  })
}
function* handleRegisterAgent () {
  while (true) {
    const action = yield take('REGISTER_AGENT');
    yield put({ type: 'SET_LOADING_TEXT', payload: '登録処理中' });
    const { payload, error } = yield call(registerAgent, firebase, action.payload.data)
      // : yield call(modify, action.payload.data, firebase)
    yield put({ type: 'SET_LOADING_TEXT', payload: null })
    if (!error) {
      if (payload && payload.result === true) {
        yield put({ type: 'SUCCESSFUL_REGISTER_ALL', payload: payload })
      } else {
        yield put({ type: 'FAILED_REGISTER', payload: payload })
        if(typeof payload.errMessage !== 'undefined')
          alertErrorMessage(payload.errMessage)
      }
    } else {
      if(typeof payload.errCode !== 'undefined')
        alertErrorMessage(error.errCode)
    }
  }
}

function registerAgent (firebase, userData) {
  return new Promise( async (resolve) => {
    try {
      userData.uid = userData.agentID;
      const response = await axios.post('/api/agent/register', userData)
        .catch((err) => {
          console.error(err)
        })
      console.log(response)
      resolve({
        payload: {
          result: response.data.result,
          errMessage: response.data.message
        }
      })
    } catch (err) {
      console.error('Crashed at register.', err)
      resolve({
        payload: null,
        error: { errCode: '03 Register Failed.' }
      })
    }
  })
}

function* handleGetAddress() {
  while(true){
    const action = yield take('GET_ADDRESS');
    yield put({ type: 'SET_LOADING_TEXT', payload: '登録処理中' });
    const { payload, error } = yield call(getAddress, action.payload.postalCode);
    if(!error){
      yield put({ type: 'SET_LOADING_TEXT', payload: null })
      if (payload && payload.result === true) {
        yield put({ type: 'SUCCESSFUL_GET_ADDRESS', payload: payload })
      } else {
        yield put({ type: 'FAILED_GET_ADDRESS', payload: {errMessage: error} })
      }
    } else {
      yield put({ type: 'FAILED_GET_ADDRESS', payload: {errMessage: error} })
    }
  }
}

function getAddress(postalCode){
  return new Promise(async (resolve, reject) => {
    try{
      const result = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', { params : {
        'components': `postal_code:${postalCode}`,
        'key': Constants.GOOGLE_MAP_API_KEY,
        'language': 'ja'
      }})
      .catch(err => {
        console.log(err);
      })
      const response = result.data.results[0];
      if(result.status === 200 && result.data.status !== "ZERO_RESULTS" && result.data.results.length > 0){
        resolve({
          payload: {
            result: true,
            prefecture: response.address_components[3].long_name,
            city: response.address_components[2].long_name,
            town: response.address_components[1].long_name,
            error: null
          }
        })
      }
      else{
        resolve({
          payload: {
            result: false,
            error: "invalid postal code"
          }
        })
      }
    }
    catch(err) {
      reject({error: err})
    }
  })
}

export default function* (firebaseRef) {
  firebase = firebaseRef
  yield fork(handleUserSignUp)
  yield fork(handleGoogleSignup)
  yield fork(handleFacebookSignup)
  yield fork(handleTwitterSignup)
  yield fork(handleCheckUser)
  yield fork(handleRegisterUser)
  yield fork(handleRegisterAgent)
  yield fork(handleGetAddress)
}