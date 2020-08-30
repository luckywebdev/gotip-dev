import { call, put, fork, take } from 'redux-saga/effects';
import axios from 'axios'
import { alertErrorMessage, alertAccountSuccessMessage } from './commonAlert';

let firebase;
function* handleApprove() {
    while (true) {
        const action = yield take('TRY_APPROVE')
        const { payload, error } = yield call(tryApprove, firebase, action.payload)
        yield put({ type: 'SET_LOADING_TEXT', payload: '処理中' })
        if (!error) {
            if(payload && payload.result === true){
                yield put({ type: 'APPROVE_SUCCESS', payload: null })
                yield put({ type: 'SET_LOADING_TEXT', payload: null })
            }
            else{
            if(typeof payload.error !== 'undefined')
                alertErrorMessage(error)
            }
        } else {
            if(typeof error.errCode !== 'undefined')
                alertErrorMessage(error.errCode)
        }
    }
}

function tryApprove(firebase, agentData){
    return new Promise(async (resolve, reject) => {
        try{
            firebase.auth().onAuthStateChanged(async (user) => {
                if(firebase.auth().currentUser){
                    const userData = {uid: firebase.auth().currentUser.uid, agentID: agentData.agentID, statusCode: agentData.approveStatus, currentStatus: agentData.currentStatus}
                    const response = await axios.post(`/api/agent/updateStatus`, userData);
                    const data = response.data ? response.data : {}
                    if(response && agentData.approveStatus === 2){
                        userData.content = agentData.content;
                        const res = await axios.post(`/api/agent/holdMessage`, userData);
                    }
                    resolve({
                        payload: data,
                        error: null
                    })
                }
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
  
function* handleSearch() {
    while (true) {
        const action = yield take('TRY_SEARCH')
        const { payload, error } = yield call(trySearch, firebase, action.payload)
        yield put({ type: 'SET_LOADING_TEXT', payload: '処理中' })
        if (!error) {
            if(payload && payload.result === true){
                yield put({ type: 'SEARCH_SUCCESS', payload: payload })
                yield put({ type: 'SET_LOADING_TEXT', payload: null })
            }
            else{
            if(typeof payload.error !== 'undefined')
                alertErrorMessage(error)
            }
        } else {
            if(typeof error.errCode !== 'undefined')
                alertErrorMessage(error.errCode)
        }
    }
}

function trySearch(firebase, filterOptions){
    return new Promise(async (resolve, reject) => {
        try{
            const response = await axios.post(`/api/agent/search`, filterOptions);
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

function* handleCheckAgent() {
    while (true) {
        const action = yield take('TRY_CHECK_AGENT')
        const { payload, error } = yield call(tryCheckAgent, firebase, action.payload)
        yield put({ type: 'SET_LOADING_TEXT', payload: '処理中' })
        if (!error) {
            if(payload && payload.result === true){
                yield put({ type: 'SET_LOADING_TEXT', payload: null })
            }
            else{
            if(typeof payload.error !== 'undefined')
                alertErrorMessage(error)
            }
        } else {
            if(typeof error.errCode !== 'undefined')
                alertErrorMessage(error.errCode)
        }
    }
}

function tryCheckAgent(){
    return new Promise(async (resolve, reject) => {
        try{
            const response = await axios.post(`/api/agent/check`);
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

function* handleSendMessage() {
    while (true) {
        const action = yield take('SEND_MESSAGE')
        const { payload, error } = yield call(sendMessage, firebase, action.payload)
        yield put({ type: 'SET_LOADING_TEXT', payload: '処理中' })
        if (!error) {
            if(payload && payload.result === true){
                yield put({ type: 'SEND_MESSAGE_SUCCESS', payload: payload })
                yield put({ type: 'SET_LOADING_TEXT', payload: null })
            }
            else{
            if(typeof payload.error !== 'undefined')
                alertErrorMessage(error)
            }
        } else {
            if(typeof error.errCode !== 'undefined')
                alertErrorMessage(error.errCode)
        }
    }
}

function sendMessage(firebase, messageContent){
    return new Promise( async (resolve) => {
        try {
            const reqContent = {imgUrl: messageContent.qrUrl, agentID: messageContent.agentID};
            const response = await axios.post('/api/agent/upload', reqContent)
                .catch((err) => {
                  console.error(err)
                })
            if(response.data.result){
                messageContent.imgUrl = response.data.uploadedUrl[0];
                const res = await axios.post('/api/agent/sendMessage', messageContent)
                resolve({
                    payload: {
                        result: res.data.result,
                    }
                })
    
            }
        } catch (err) {
          console.error('Crashed at register.', err)
          resolve({
            payload: null,
            error: { errCode: '03 Register Failed.' }
          })
        }
    })
}

export default function* (firebaseRef) {
    firebase = firebaseRef
    yield fork(handleApprove)
    yield fork(handleCheckAgent)
    yield fork(handleSearch)
    yield fork(handleSendMessage)
  }