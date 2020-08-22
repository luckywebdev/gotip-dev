import { call, put, fork, take } from 'redux-saga/effects'
import { alertErrorMessage } from './commonAlert'
import axios from 'axios'

function* handleRefreshNewInformation () {
  while (true) {
    const action = yield take('REFRESH_NEW_INFORMATION')
    const { payload, error } = yield call(load)
    yield put({ type: 'SET_LOADING_TEXT', payload: '新着情報登録中' })
    yield put({ type: 'SET_NEW_INFORMATION', payload })
    yield put({ type: 'SET_LOADING_TEXT', payload: null })
    if (error) console.error(error)
  }
}
function load () {
  return new Promise((resolve) => {
    axios.get('/api/info/get')
    .then((response) => {
      resolve({
        payload: response.data ? response.data : {}
      })
    }).catch((err) => {
      console.error(err)
      resolve({
        payload: {},
        error: err.message
      })
    })
  })
}


function* handleInformationPost () {
  while (true) {
    const action = yield take('POST_NEW_INFORMATION')

    yield put({ type: 'SET_LOADING_TEXT', payload: '新着情報登録中' })
    const { payload, error } = yield call(postInfo, action.payload)
    if(!error){
      if(payload && payload.result === true) {
        yield put({ type: 'CLEAR_INFORMATION_INPUT', payload })
        yield put({ type: 'REFRESH_NEW_INFORMATION', payload })
      }
      else {
        yield put({ type: 'SET_LOADING_TEXT', payload: null })
        alertErrorMessage(payload.errMessage)
      }
    }
    else  alertErrorMessage(error.errCode)
  }
}
function postInfo (payload) {
  return new Promise(async (resolve) => {
    try{
      window.getIdToken()
      .then(async idToken => {
        if(payload.fileContent.name) {
          const storageRef = firebase.storage().ref();
          console.log("storageRef", storageRef);
          const mainFile = storageRef.child(`image/${payload.fileContent.name}`);
          mainFile.put(payload.fileContent).then((snapshot) => {
            mainFile.getDownloadURL().then(async (url) => {
              payload.imageUrl = url;
              let endpoint = 'post';
              if(payload.editFlag === 'update'){
                endpoint = 'update';
              }
              const response = await axios.post(`/api/info/${endpoint}`, payload, { params: { idToken } })
              .catch((err) => {
                console.error(err)
              })
              console.log("postInfo_result", response);
              resolve({
                payload: {
                  result: response.data.result,
                  errMessage: response.data.errMessage
                }
              })
            })
          })
        }
        else {
          payload.imageUrl = "";
          let endpoint = 'post';
          if(payload.editFlag === 'update'){
            endpoint = 'update';
          }

          const response = await axios.post(`/api/info/${endpoint}`, payload, { params: { idToken } })
          .catch((err) => {
            console.error(err)
          })
          console.log("postInfo_result", response);
          resolve({
            payload: {
              result: response.data.result,
              errMessage: response.data.errMessage
            }
          })
        }
      })
    } catch(err) {
      console.error('Crashed at register.', err)
      resolve({
        payload: null,
        error: { errCode: '10 Post Failed.' }
      })
    }
  })
}

function* handlePostedInformationGet () {
  while (true) {
    const action = yield take('GET_POSTED_INFORMATION')
    const { payload, error } = yield call(get_info, action.payload)
    yield put({ type: 'SET_POSTED_INFORMATION', payload })
    if (error) console.error(error)
  }
}
function get_info (payload) {
  return new Promise((resolve) => {
    console.log("postedTime", payload);
    axios.post('/api/info/get_posted', payload)
    .then((response) => {
      console.log("posted_result", response);
      resolve({
        payload: response.data ? response.data : {}
      })
    }).catch((err) => {
      console.error(err)
      resolve({
        payload: {},
        error: err.message
      })
    })
  })
}

function* handleInformationDelete () {
  while (true) {
    const action = yield take('DELETE_NEW_INFORMATION')

    yield put({ type: 'SET_LOADING_TEXT', payload: '新着情報削除中' })
    const { payload, error } = yield call(deleteInfo, action.payload)
    yield put({ type: 'REFRESH_NEW_INFORMATION', payload })
    yield put({ type: 'SET_LOADING_TEXT', payload: null })
    if (error) console.error(error)
  }
}
function deleteInfo (payload) {
  return new Promise(async (resolve) => {
    window.getIdToken()
    .then(async idToken => {
      const response = await axios.post('/api/info/delete', payload, { params: { idToken } })
      .catch((err) => {
        console.error(err)
      })
      resolve({
        payload: {
          result: response.data.result,
          errMessage: response.data.errMessage
        }
      })
    })
  })
}

let firebase;

export default function* (firebaseRef) {
  firebase = firebaseRef
  yield fork(handleRefreshNewInformation)
  yield fork(handleInformationPost)
  yield fork(handlePostedInformationGet)
  yield fork(handleInformationDelete)
}