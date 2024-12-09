import axios from 'axios';

const api = axios.create({
  baseURL: 'http://10.0.2.2:3000/api/v1',
  // baseURL: 'http://192.168.2.16:3000/api/v1',

});

export default api;