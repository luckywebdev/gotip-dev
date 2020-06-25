import { call, put, fork, take } from 'redux-saga/effects'

export default function* handleGoTipShowSate() {
  while (true) {
    const action = yield take('GoTip_SHOW'); 
    console.log("show_state_action", action);   
    try {
      yield put({ type: 'GoTip_SHOW_SUCCESS', payload: action.payload });
    } catch(err) {
      console.error(err);
    }
  }
}

