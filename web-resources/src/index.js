import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { createBrowserHistory } from "history";

import { Provider } from 'react-redux'
import store from './store/store'

import App from './App';

const hist = createBrowserHistory();
const app = (
    <Provider store={ store }>
        <BrowserRouter history={ hist }>
            <App />
       </BrowserRouter>
    </Provider>
);


ReactDOM.render( app, document.getElementById('root'));

