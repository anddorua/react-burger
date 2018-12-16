import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://react-my-burger-3f193.firebaseio.com/',
});

export default instance;