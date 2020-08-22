import { applyMiddleware, createStore, combineReducers } from "redux";
import createSagaMiddleware from 'redux-saga';
import rootSaga from './sagas/root';
import reducerLogin from "./reducers/login";
import reducerMain from "./reducers/main";
import reducerAdmin from "./reducers/admin";
import reducerBLE from "./reducers/bleManage";
import reducerSignup from "./reducers/registration";
import reducerContact from "./reducers/contact";
import reducerUserEdit from "./reducers/userEdit";

const logWriter = (store) => (next) => (action) => {
  console.log('Log：', store.getState(), 'Action:', action)
  next(action)
}

function createAppStore () {
  const sagaMiddleWare = createSagaMiddleware()
  const store = createStore(
    combineReducers({
      login: reducerLogin,
      main: reducerMain,
      admin: reducerAdmin,
      userEdit: reducerUserEdit,
      bleManage: reducerBLE,
      contact: reducerContact,
      registration: reducerSignup
    }),
    applyMiddleware(
      logWriter,
      sagaMiddleWare
    )
  )
  sagaMiddleWare.run(rootSaga.bind(null, store.dispatch))
  return store
}

export default createAppStore()