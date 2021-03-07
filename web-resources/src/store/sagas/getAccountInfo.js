import { call, put, fork, take } from 'redux-saga/effects';
import UIkit from 'uikit'
import { alertErrorMessage } from './commonAlert'
import axios from 'axios'


function* handleUserGetAccountInfo () {
  while (true) {
    const action = yield take('GET_ACCOUNT_INFO')

    const { payload, error } = yield call(getAccountInfo, firebase, action.payload)
    yield put({ type: 'SET_LOADING_TEXT', payload: 'データロード中' })
    if (!error && typeof payload.account !== "undefined") {
      yield put({ type: 'SET_ACCOUNT_INFO', payload: payload.account ? payload.account : {} })
      yield put({type: 'REFRESH_POINTS'});
      yield put({ type: 'CHANGE_LOGIN_STATE', payload: { isLogedIn: true, gettingState: true } })
      yield put({ type: 'SET_LOADING_TEXT', payload: null })
    } else {
      if(error && typeof error.errCode !== 'undefined' ){
        alertErrorMessage(error.errCode)
      }
      localStorage.clear();
      window.location.reload()
    }
  }
}

async function getAccountInfo (firebase, uid) {
  return new Promise(async (resolve, reject) => {
    firebase.auth().onAuthStateChanged((user) => {
      if(firebase.auth().currentUser){
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
      }
      else{
        resolve({
          error: 'no logged in now!'
        })
      }
    })
  })
}

function* handleGetChildAgent () {
  while (true) {
    const action = yield take('GET_CHILD_AGENT')

    const { payload, error } = yield call(getChildAgent, firebase, action.payload)
    yield put({ type: 'SET_LOADING_TEXT', payload: 'データロード中' })
    if (!error && typeof payload.result !== "undefined") {
      yield put({ type: 'SET_CHILD_AGENT', payload: payload.childs ? payload.childs: {} })
      yield put({ type: 'SET_LOADING_TEXT', payload: null })
    } else {
      if(error && typeof error.errCode !== 'undefined' ){
        alertErrorMessage(error.errCode)
      }
      // localStorage.clear();
      // window.location.reload()
    }
  }
}

async function getChildAgent (firebase, reqData) {
  return new Promise(async (resolve, reject) => {
    firebase.auth().onAuthStateChanged((user) => {
      if(firebase.auth().currentUser){
        firebase.auth().currentUser.getIdToken(true)
        .then((idToken) => {
          axios.post('/api/agent/getChild', { uid: firebase.auth().currentUser.uid, type: reqData.type })
          .then((response) => {
            const data = response.data ? response.data : {}
            // if (data.result) data.account.userid = firebase.auth().currentUser.uid
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
      }
      else{
        resolve({
          error: 'no logged in now!'
        })
      }
    })
  })
}

function* handleOtherUserGetAccountInfo () {
  while (true) {
    const action = yield take('GET_OTHER_ACCOUNT_INFO')

    const { payload, error } = yield call(getOtherAccountInfo, firebase, action.payload)
    yield put({ type: 'SET_LOADING_TEXT', payload: 'データロード中' })
    if (!error) {
      yield put({ type: 'SET_OTHER_ACCOUNT_INFO', payload: payload ? payload : {} })
      yield put({ type: 'SET_LOADING_TEXT', payload: null })
    } else {
      alertErrorMessage(error.error)
      localStorage.clear();
      window.location.reload()
    }
  }
}

async function getOtherAccountInfo (firebase, uid) {
  return new Promise(async (resolve, reject) => {
    try{
      const response = await axios.get(`/api/user/profile/${uid}`);
      console.log("point_response", response);
      const data = response.data ? response.data : {}
      if (data.account) data.account.userid = uid
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
function* handleOtherAgentGetAccountInfo () {
  while (true) {
    const action = yield take('GET_OTHER_AGENT_ACCOUNT_INFO')
    const { payload, error } = yield call(getOtherAgentAccountInfo, firebase, action.payload)
    yield put({ type: 'SET_LOADING_TEXT', payload: 'データロード中' })
    if (!error) {
      yield put({ type: 'SET_OTHER_AGENT_ACCOUNT_INFO', payload: payload ? payload : {} })
      yield put({ type: 'SET_LOADING_TEXT', payload: null })
    } else {
      if(typeof error.error !== 'undefined'){
        alertErrorMessage(error.error)
      }
      localStorage.clear();
      window.location.reload()
    }
  }
}

async function getOtherAgentAccountInfo (firebase, uid) {
  return new Promise(async (resolve, reject) => {
    try{
      const response = await axios.get(`/api/user/profile/${uid}`);
      const data = response.data ? response.data : {}
      if (data.account) data.account.userid = uid;
      console.log("getotherAgentAccountData", data);
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

function* handleGetCreatorList() {
  while (true) {
    const action = yield take('GET_CREATOR_LIST')
    const { payload, error } = yield call(getCreatorList, firebase)
    yield put({ type: 'SET_LOADING_TEXT', payload: 'データロード中' })
    if (!error) {
      yield put({ type: 'SET_CREATOR_LIST', payload: payload ? payload : [] })
      yield put({ type: 'SET_LOADING_TEXT', payload: null })
    } else {
      if(typeof error.error !== 'undefined'){
        alertErrorMessage(error.error)
      }
      localStorage.clear();
      window.location.reload()
    }
  }
}

function getCreatorList(firebase){
  return new Promise (async (resolve, reject) => {
    try{
      const response = await axios.get(`/api/user/getCreator`);
      const data = response.data ? response.data : {};
      console.log("creatorList", data);
      if(data.result){
        resolve({
          payload: data,
          error: null
        })
      }
      else{
        resolve({
          payload: null,
          error: payload
        })
      }
    }
    catch(err) {
      reject({
        payload: null,
        error: err
      })
    }
  })
}

let firebase
export default function* (firebaseRef) {
  firebase = firebaseRef
  yield fork(handleUserGetAccountInfo)
  yield fork(handleGetChildAgent)
  yield fork(handleGetCreatorList)
  yield fork(handleOtherAgentGetAccountInfo)
  yield fork(handleOtherUserGetAccountInfo)
}