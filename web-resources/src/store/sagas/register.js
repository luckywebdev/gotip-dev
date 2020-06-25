import { call, put, fork, take } from 'redux-saga/effects'
import axios from 'axios'
import alertErrorMessage from './commonAlert'


export default function* registerUser (firebase) {
  while (true) {
    const action = yield take('REGISTER_USER');

    yield put({ type: 'REGISTRATION_INPUT', payload: action.payload.data });
    yield put({ type: 'SET_LOADING_TEXT', payload: '登録処理中' });
    const { payload, error } = action.payload.isNew ?
      yield call(register, action.payload.data)
      : yield call(modify, action.payload.data, firebase)
    yield put({ type: 'SET_LOADING_TEXT', payload: null })
    
    if (!error) {
      if (payload && payload.result === true) {
        yield put({ type: 'SUCCESSFUL_REGISTER', payload: payload })
        yield put({ type: 'TRY_LOGIN', payload: {
          email: payload.email,
          password: payload.password
        } })
      } else {
        yield put({ type: 'FAILED_REGISTER', payload: payload })
        alertErrorMessage(payload.message)
      }
    } else {
      alertErrorMessage(error.errCode)
    }
  }
}

function register (userData) {
  return new Promise( async (resolve) => {
    try {
      const params = new URLSearchParams()
      params.append('email', userData.email)
      params.append('password', userData.password)
      params.append('name', userData.name)
      params.append('ruby', userData.ruby)
      params.append('nickname', userData.nickname)
      params.append('sex', userData.sex)
      params.append('birthyear', userData.birthdate.year)
      params.append('birthmonth', userData.birthdate.month)
      params.append('birthday', userData.birthdate.day)
      params.append('themeColor', userData.color)
      let tel = userData.tel ? userData.tel.replace(/[^0-9]/g, '') : null
      if (tel && tel.length === 11) params.append('tel', tel)

      params.append('userId', userData.userid)
      const response = await axios.post('/api/user/create', params)
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
        error: { errCode: '02 Register Failed.' }
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