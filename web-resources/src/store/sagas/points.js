import { call, put, fork, take } from 'redux-saga/effects'
import alertErrorMessage from './commonAlert'
import axios from 'axios'

function* handleRefreshPoints () {
  while (true) {
    const action = yield take('REFRESH_POINTS')
    const { payload, error } = yield call(load)
    yield put({ type: 'SET_POINTS_INFO', payload })
    if (error) console.error(error)
  }
}
function load () {
  return new Promise((resolve) => {

    firebase.auth().currentUser.getIdToken(true)
    .then((idToken) => {
      axios.get('/api/points/getinfo', { params: { idToken } })
      .then((response) => {
        resolve({
          payload: response.data ? response.data : {}
        })
      }).catch((err) => {
        console.error(err)
        resolve({
          error: err.message
        })
      })
    })
  })
}




function* handlePurchase () {
  while (true) {
    //購入処理実装予定
    const action = yield take('PURCHASE_POINTS')

    const { payload, error } = yield call(purchase, action.payload)

    yield put({ type: 'REFRESH_POINTS', payload })
    if (error) console.error(error)
  }
}
function purchase (payload) {
  return new Promise((resolve) => {
    firebase.auth().currentUser.getIdToken(true)
    .then((idToken) => {
      axios.post('/api/points/purchase/add', {
        idToken,
        value: payload.value
      })
      .then((response) => {
        resolve({
          payload: response.data ? response.data : {}
        })
      }).catch((err) => {
        console.error(err)
        resolve({
          error: err.message
        })
      })
    })
  })
}

function* handleSendChip () {
  while (true) {
    //購入処理実装予定
    const action = yield take('SEND_CHIP')

    const { payload, error } = yield call(sendChip, firebase, action.payload)

    if(!error){
      yield put({ type: 'SEND_CHIP_SUCCESSFULL', payload })
      yield put({ type: 'REFRESH_POINTS' })
      yield put({ type: 'GET_OTHER_ACCOUNT_INFO', payload: action.payload.recID })
    }
    else{
      if(typeof error.error !== 'undefined'){
        alertErrorMessage(error.error)
      }
    }
  }
}

function sendChip(firebase, chipData){
  return new Promise (async (resolve, reject) => {
    console.log("chipData", chipData);
    await axios.post('/api/points/sendChip', chipData)
    .then((res) => {
      resolve(res.data);
    })
    .catch(err => {
      reject(err)
    })
  })
}

function* handleConvertPoints () {
  while (true) {
    //購入処理実装予定
    const action = yield take('CONVERT_POINTS')

    const { payload, error } = yield call(convertPoints, firebase, action.payload)

    if(!error){
      yield put({ type: 'CONVERT_SUCCESSFULL', payload })
      yield put({ type: 'REFRESH_POINTS' })
    }
    else{
      if(typeof error.error !== 'undefined'){
        alertErrorMessage(error.error)
      }
    }
  }
}

function convertPoints(firebase, points){
  return new Promise (async (resolve, reject) => {
    console.log("convertPoint", points);
    await axios.post('/api/points/convertPoints', {uid: localStorage.getItem('uid'), points: points})
    .then((res) => {
      resolve(res.data);
    })
    .catch(err => {
      reject(err)
    })
  })
}


let firebase
export default function* (firebaseRef) {
  firebase = firebaseRef
  yield fork(handleRefreshPoints)
  yield fork(handlePurchase)
  yield fork(handleSendChip)
  yield fork(handleConvertPoints)
}