import axios from "axios";

// Should just be /api if env variable isn't set, which means it will request its own domain
const baseURL = process.env.VUE_APP_BACKEND_URL + '/api';

const instance = axios.create({
  baseURL: baseURL
});

export default instance;
