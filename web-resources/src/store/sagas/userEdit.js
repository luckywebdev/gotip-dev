import { call, put, fork, take } from 'redux-saga/effects';
import UIkit from 'uikit'
import { alertErrorMessage } from './commonAlert'
import axios from 'axios'


function* handleUpdatePersonalInfo () {
  while (true) {
    const action = yield take('UPDATE_PERSONAL_INFO')
    yield put({ type: 'SET_LOADING_TEXT', payload: 'プロフィール登録中' })
    const { payload, error } = yield call(updatePersonalInfo, firebase, action.payload)
    yield put({ type: 'SET_LOADING_TEXT', payload: null })
    if (!error) {
        if (payload && payload.result === true) {
          yield put({ type: 'UPDATE_PERSONAL_INFO_SUCCESS', payload: payload })
          yield put({ type: 'GET_ACCOUNT_INFO', pyload: payload})
        } else {
          yield put({ type: 'UPDATE_PERSONAL_INFO_FAILED', payload: payload })
          alertErrorMessage(payload.message)
        }
      } else {
        alertErrorMessage(error.errCode)
      }
  }
}

async function updatePersonalInfo (firebase, userData) {
    return new Promise( async (resolve) => {
        try {
          firebase.auth().currentUser.getIdToken(true)
          .then(async (idToken) => {
            let sendData = null;
            const params = new URLSearchParams()
            params.append('idToken', idToken)
            if (userData) {
              if(userData.sns_info){
                userData.idToken = idToken;
                sendData = userData;
              }
              else{
                Object.keys(userData).forEach(key => {
                  params.append(key, userData[key])
                })
                sendData = params;
              }

            }
    
            const response = await axios.post('/api/user/setprofile', sendData)
              .catch((err) => {
                console.error(err)
              })
            console.log(response, userData)
            resolve({
              payload: {
                result: response.data.result,
                errMessage: response.data.message
              }
            })
          })
        } catch (err) {
          console.error('Crashed at register profile.', err)
          resolve({
            payload: null,
            error: { errCode: '03 Register Profile Failed.' }
          })
        }
    })
}

function* handleChangeState() {
  while (true) {
    const action = yield take('CHANGE_STATE');
    try {
      yield put({ type: 'CHANGE_STATE_SUCCESS', payload: action.payload });
    } catch(err) {
      console.error(err);
    }
  }
}

function* handleUploadImage() {
  while (true) {
    const action = yield take('UPLOAD_PHOTO');
    yield put({ type: 'SET_LOADING_TEXT', payload: 'プロフィール登録中' });
    const { payload, error } = yield call(uploadImage, firebase, action.payload);
    if (!error) {
      if (payload && payload.result === true) {
        yield put({ type: 'CHANGE_LOGIN_STATE', payload: { isLogedIn: false, gettingState: false } })
        yield put({ type: 'GET_ACCOUNT_INFO', pyload: payload})
        yield put({ type: 'UPLOAD_IMAGE_SUCCESS', payload: payload })
        yield put({ type: 'SET_LOADING_TEXT', payload: null });
      } else {
        yield put({ type: 'UPLOAD_IMAGE_FAILED', payload: payload })
        yield put({ type: 'SET_LOADING_TEXT', payload: null });
        alertErrorMessage(payload.message)
      }
    } else {
      yield put({ type: 'SET_LOADING_TEXT', payload: null });
      alertErrorMessage(error.errCode)
    }

  }
}

async function uploadImage (firebase, imageData) {
  return new Promise( async (resolve) => {
    try {
      firebase.auth().currentUser.getIdToken(true)
      .then(async (idToken) => {
        const uid = firebase.auth().currentUser.uid;
        const params = new URLSearchParams()
        params.append('idToken', idToken)
        params.append('uid', uid);
        if (imageData) {
          Object.keys(imageData).forEach(key => {
            params.append(key, imageData[key])
          })
        }

        const response = await axios.post('/api/upload/image', params)
          .catch((err) => {
            console.error(err)
          })
        console.log(response, imageData)
        resolve({
          payload: {
            result: response.data.result,
            uploadedUrl: response.data.uploadedUrl,
            errMessage: response.data.message
          }
        })
      })
    } catch (err) {
      console.error('Crashed at Upload Image.', err)
      resolve({
        payload: null,
        error: { errCode: '04 Upload Image Failed.' }
      })
    }
  })
}

let firebase;
export default function* (firebaseRef) {
  firebase = firebaseRef
  yield fork(handleUpdatePersonalInfo)
  yield fork(handleChangeState)
  yield fork(handleUploadImage)
  // yield fork(handleUpdateSnsInfo)
}