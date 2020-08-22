import { call, put, fork, take } from 'redux-saga/effects';
import UIkit from 'uikit'
import { alertErrorMessage } from './commonAlert'
import axios from 'axios'

function* handleBLESearch (firebase) {
    while (true) {
      const action = yield take('BLE_CONNECT')
      const { payload, error } = yield call(bleConnect, firebase, action.payload)
      yield put({ type: 'SET_LOADING_TEXT', payload: 'データロード中' })
      if (!error) {
        if (payload && payload.result === true) {
            yield put({ type: 'BLE_CONNECT_SUCCESS', payload: payload })
            yield put({ type: 'SET_LOADING_TEXT', payload: null })
        }
        else{
            yield put({ type: 'BLE_CONNECT_FAILED', payload: payload })
            alertErrorMessage(payload.errMessage)
        }
      } else {
        alertErrorMessage(error.errCode)
      }
    }
  }
  
  async function bleConnect (firebase, device) {
    return new Promise(async (resolve, reject) => {
        try{
            setTimeout(() => {
                const data = {result: true, device_name: device.name, device_uuid: device.uuid};
                resolve({
                    payload : data
                }, 3000)
            })
        } catch(err) {
            reject({
                payload: null,
                error: {errCode: err}
            });
        }
        
    });
}
function* handleBLESetting (firebase) {
    while (true) {
        const action = yield take('BLE_SETTING')
        try {
            yield put({ type: 'BLE_SETTING_SUCCESS', payload: action.payload });
        } catch(err) {
            console.error(err);
            yield put({ type: 'BLE_SETTING_FAILED', payload: { result: false, errMessage: "Failed setting" } });
        }
    }
}
  
function* handleBLERemove (firebase) {
    while (true) {
        const action = yield take('BLE_REMOVE')
        try {
            yield put({ type: 'BLE_REMOVE_SUCCESS', payload: action.payload });
        } catch(err) {
            console.error(err);
            yield put({ type: 'BLE_REMOVE_FAILED', payload: { result: false, errMessage: "Failed remove" } });
        }
    }
}

let firebase;
export default function* (firebaseRef) {
  firebase = firebaseRef
  yield fork(handleBLESearch)
  yield fork(handleBLESetting)
  yield fork(handleBLERemove)
}