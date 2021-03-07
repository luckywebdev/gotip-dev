import { call, put, fork, take } from 'redux-saga/effects';
import axios from 'axios'
import { alertErrorMessage, alertAccountSuccessMessage } from './commonAlert';

let firebase;
function* handleNoticeCreate () {
    while (true) {
      const action = yield take('CREATE_NOTICE');
      yield put({ type: 'SET_LOADING_TEXT', payload: '登録処理中' });
      const { payload, error } = yield call(noticeCreate, firebase, action.payload)
        // : yield call(modify, action.payload.data, firebase)
      yield put({ type: 'SET_LOADING_TEXT', payload: null })
      if (!error) {
        if (payload && payload.result === true) {
          yield put({ type: 'SUCCESSFUL_CREATE_NOTICE', payload: payload })
          yield put({type: 'GET_NOTICE'})
        } else {
          yield put({ type: 'FAILED_CREATE_NOTICE', payload: payload })
          if(typeof payload.errMessage !== 'undefined')
            alertErrorMessage(payload.errMessage)
        }
      } else {
        if(typeof payload.errCode !== 'undefined')
          alertErrorMessage(error.errCode)
      }
    }
  }
  
  function noticeCreate (firebase, noticeData) {
    return new Promise( async (resolve) => {
      try {
          console.log("noticeData", noticeData);
        const response = await axios.post('/api/admin/noticeCreate', noticeData)
          .catch((err) => {
            console.error("noticeCreate_Err", err)
          })
        console.log(response)
        resolve({
          payload: {
            result: response.data.result,
            errMessage: response.data.error
          }
        })
      } catch (err) {
        console.error('Crashed at register.', err)
        resolve({
          payload: null,
          error: { errCode: err }
        })
      }
    })
  }
  function* handleNoticeUpdate () {
    while (true) {
      const action = yield take('UPDATE_NOTICE');
      yield put({ type: 'SET_LOADING_TEXT', payload: '登録処理中' });
      const { payload, error } = yield call(noticeUpdate, firebase, action.payload)
      yield put({ type: 'SET_LOADING_TEXT', payload: null })
      if (!error) {
        if (payload && payload.result === true) {
          yield put({ type: 'SUCCESSFUL_UPDATE_NOTICE', payload: payload })
          yield put({type: 'GET_NOTICE'})
        } else {
          yield put({ type: 'FAILED_UPDATE_NOTICE', payload: payload })
          if(typeof payload.errMessage !== 'undefined')
            alertErrorMessage(payload.errMessage)
        }
      } else {
        if(typeof payload.errCode !== 'undefined')
          alertErrorMessage(error.errCode)
      }
    }
  }
  
  function noticeUpdate (firebase, noticeData) {
    return new Promise( async (resolve) => {
      try {
        const response = await axios.post('/api/admin/noticeUpdate', noticeData)
          .catch((err) => {
            console.error(err)
          })
        console.log(response)
        resolve({
          payload: {
            result: response.data.result,
            errMessage: response.data.error
          }
        })
      } catch (err) {
        console.error('Crashed at register.', err)
        resolve({
          payload: null,
          error: { errCode: err }
        })
      }
    })
  }
  function* handleGetNotice () {
    while (true) {
      const action = yield take('GET_NOTICE');
      yield put({ type: 'SET_LOADING_TEXT', payload: '登録処理中' });
      const { payload, error } = yield call(getNotice)
      if (!error) {
        yield put({ type: 'SET_LOADING_TEXT', payload: null })
        if (payload && payload.result === true) {
            yield put({ type: 'SUCCESSFUL_GET_NOTICE', payload: payload })
        } else {
          yield put({ type: 'FAILED_GET_NOTICE', payload: payload })
          if(typeof payload.errMessage !== 'undefined')
            alertErrorMessage(payload.errMessage)
        }
      } else {
        if(typeof error.errCode !== 'undefined')
          alertErrorMessage(error.errCode)
      }
    }
  }
  
  function getNotice () {
    return new Promise( async (resolve) => {
      try {
        const response = await axios.post('/api/admin/getNotice')
          .catch((err) => {
            console.error(err)
          })
        console.log(response)
        resolve({
          payload: {
            result: response.data.result,
            noticeData: response.data.noticeData,
            errMessage: response.data.error
          }
        })
      } catch (err) {
        console.error('Crashed at register.', err)
        resolve({
          payload: null,
          error: { errCode: err }
        })
      }
    })
  }

  function* handleUserSearch(){
    while (true) {
      const action = yield take('USER_SEARCH');
      yield put({ type: 'SET_LOADING_TEXT', payload: '処理中' });
      const { payload, error } = yield call(userSearch, action.payload)
      if (!error) {
        yield put({ type: 'SET_LOADING_TEXT', payload: null })
        if (payload && payload.result === true) {
            yield put({ type: 'SUCCESSFUL_USER_SEARCH', payload: payload })
        } else {
          yield put({ type: 'FAILED_USER_SEARCH', payload: payload })
          if(typeof payload.errMessage !== 'undefined')
            alertErrorMessage(payload.errMessage)
        }
      } else {
        if(typeof payload.errCode !== 'undefined')
          alertErrorMessage(error.errCode)
      }
    }
  }

  function userSearch (filterData) {
    return new Promise( async (resolve) => {
      try {
        console.log("filter_data", filterData);
        const response = await axios.post('/api/admin/userSearch', filterData)
          .catch((err) => {
            console.error(err)
          })
        console.log(response)
        resolve({
          payload: {
            result: response.data.result,
            userList: response.data.userList,
            errMessage: response.data.error
          }
        })
      } catch (err) {
        console.error('Crashed at register.', err)
        resolve({
          payload: null,
          error: { errCode: err }
        })
      }
    })
  }

  function* handleUserDelete(){
    while (true) {
      const action = yield take('USER_DELETE');
      yield put({ type: 'SET_LOADING_TEXT', payload: '処理中' });
      const { payload, error } = yield call(userDelete, action.payload.uidArray)
      if (!error) {
        yield put({ type: 'SET_LOADING_TEXT', payload: null })
        if (payload && payload.result === true) {
            yield put({ type: 'SUCCESSFUL_USER_DELETE', payload: payload })
            yield put({ type: 'USER_SEARCH', payload: action.payload.filterData })
        } else {
          yield put({ type: 'FAILED_USER_DELETE', payload: payload })
          if(typeof payload.errMessage !== 'undefined')
            alertErrorMessage(payload.errMessage)
        }
      } else {
        if(typeof payload.errCode !== 'undefined')
          alertErrorMessage(error.errCode)
      }
    }
  }

  function userDelete (uidArray) {
    return new Promise( async (resolve) => {
      try {
        const reqData = {uidArray: uidArray};
        const response = await axios.post('/api/admin/deleteUser', reqData)
          .catch((err) => {
            console.error(err)
          })
        console.log(response)
        resolve({
          payload: {
            result: response.data.result,
            errMessage: response.data.error
          }
        })
      } catch (err) {
        console.error('Crashed at register.', err)
        resolve({
          payload: null,
          error: { errCode: err }
        })
      }
    })
  }
  function* handleCreatorSearch(){
    while (true) {
      const action = yield take('CREATOR_SEARCH');
      yield put({ type: 'SET_LOADING_TEXT', payload: '処理中' });
      const { payload, error } = yield call(creatorSearch, action.payload)
      if (!error) {
        yield put({ type: 'SET_LOADING_TEXT', payload: null })
        if (payload && payload.result === true) {
            yield put({ type: 'SUCCESSFUL_CREATOR_SEARCH', payload: payload })
        } else {
          yield put({ type: 'FAILED_CREATOR_SEARCH', payload: payload })
          if(typeof payload.errMessage !== 'undefined')
            alertErrorMessage(payload.errMessage)
        }
      } else {
        if(typeof payload.errCode !== 'undefined')
          alertErrorMessage(error.errCode)
      }
    }
  }

  function creatorSearch (agentID) {
    return new Promise( async (resolve) => {
      try {
        console.log("filter_data", agentID);
        const response = await axios.post('/api/admin/creatorSearch', {agentID})
          .catch((err) => {
            console.error(err)
          })
        console.log(response)
        resolve({
          payload: {
            result: response.data.result,
            creatorList: response.data.creatorList,
            errMessage: response.data.error
          }
        })
      } catch (err) {
        console.error('Crashed at search.', err)
        resolve({
          payload: null,
          error: { errCode: err }
        })
      }
    })
  }

  function* handleUpdateOtherUser () {
    while (true) {
      const action = yield take('UPDATE_OTHER_USER');
      yield put({ type: 'SET_LOADING_TEXT', payload: '処理中' });
      const { payload, error } = yield call(updateOtherUser, action.payload)
      if (!error) {
        yield put({ type: 'SET_LOADING_TEXT', payload: null })
        if (payload && payload.result === true) {
            yield put({ type: 'SUCCESSFUL_UPDATE_OTHER_USER', payload: payload })
            yield put({ type: 'GET_OTHER_AGENT_ACCOUNT_INFO', payload: action.payload.uid })
        } else {
          yield put({ type: 'FAILED_UPDATE_OTHER_USER', payload: payload })
          if(typeof payload.errMessage !== 'undefined')
            alertErrorMessage(payload.errMessage)
        }
      } else {
        if(typeof payload.errCode !== 'undefined')
          alertErrorMessage(error.errCode)
      }
    }
  }

  function updateOtherUser(userData) {
    return new Promise( async (resolve) => {
      try {
        firebase.auth().currentUser.getIdToken(true)
        .then(async (idToken) => {
          console.log("update_data", userData);
          userData.idToken = idToken;
          const response = await axios.post('/api/admin/updateUser', userData)
            .catch((err) => {
              console.error(err)
            })
          console.log(response)
          resolve({
            payload: {
              result: response.data.result,
              errMessage: response.data.error
            }
          })
        })
      } catch (err) {
        console.error('Crashed at search.', err)
        resolve({
          payload: null,
          error: { errCode: err }
        })
      }
    })
  }

export default function* (firebaseRef) {
    firebase = firebaseRef
    yield fork(handleNoticeCreate)
    yield fork(handleNoticeUpdate)
    yield fork(handleUserSearch)
    yield fork(handleGetNotice)
    yield fork(handleUserDelete)
    yield fork(handleCreatorSearch)
    yield fork(handleUpdateOtherUser);
  }