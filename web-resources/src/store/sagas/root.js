import { delay, eventChannel, END } from 'redux-saga';
import { call, put, fork, take } from 'redux-saga/effects';
import handleUserSignIn from './signIn';
import handleUserSignOut from './signOut';
import handleGoTipShowSate from './main';
import handleUserGetAccountInfo from './getAccountInfo';
import handleUserEdit from './userEdit';
import handleInformation from './newInformation';
import handleBLEManage from './bleManage';
import handleContact from './contact';
import handleUserRegister from './register';
import handleAgent from './agent';
import handleAdmin from './admin';
import handlePoints from './points';

// import alertErrorMessage from './commonAlert'
// import UIkit from 'uikit'

import firebase, { functions } from 'firebase/app'
import 'firebase/auth';
import 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBLmhc4Eqnhqvyz-HDuDhWjNkRoc1gMtnw",
  authDomain:"gotip-dev.firebaseapp.com",
  storageBucket: 'gotip-dev.appspot.com'
}
firebase.initializeApp(firebaseConfig)

window.getIdToken = async function getIdToken () {
  return await firebase.auth().currentUser.getIdToken(true)
}


export default function* rootSaga (dispatch) {
  yield fork(handleUserSignIn.bind(null, firebase))
  yield fork(handleUserSignOut.bind(null, firebase))
  yield fork(handleGoTipShowSate.bind(null))
  yield fork(handleUserGetAccountInfo.bind(null, firebase))
  yield fork(handleUserEdit.bind(null, firebase))
  yield fork(handleInformation.bind(null, firebase))
  yield fork(handleBLEManage.bind(null, firebase))
  yield fork(handleAgent.bind(null, firebase))
  yield fork(handleAdmin.bind(null, firebase))
  yield fork(handlePoints.bind(null, firebase))
  yield fork(handleContact)
  yield fork(handleUserRegister.bind(null, firebase))

  

//   firebase.auth().onAuthStateChanged((user) => {
//     // console.log("onAuthStateChange", user);
//     if (user) {
//       // console.log("rootsata_userid", user.metadata.lastSignInTime)
//       window.CURRENT_UID = user.uid
//       localStorage.setItem('uid', user.uid);
//       localStorage.setItem('isLoggedin', true);
//       dispatch({ type: 'GET_ACCOUNT_INFO', payload: { uid: user.uid } })
//       dispatch({ type: 'REFRESH_POINTS', payload: { uid: user.uid } })
//       dispatch({ type: 'REFRESH_NEW_INFORMATION', payload: null })
//     } else {
//       window.CURRENT_UID = null
//       dispatch({ type: 'CHANGE_LOGIN_STATE', payload: { isLogedIn: false } })
//     }
//   })
}