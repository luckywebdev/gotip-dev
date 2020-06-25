import axios from 'axios';
import * as Constants from './Constants';

const instance = axios.create({
    baseURL: Constants.API_BASE_URL
});

export default instance;