// ApiService.js

import axios from 'axios';

// const API_BASE_URL = 'https://starklogics.com/kenban/api/';
const API_BASE_URL = 'http://127.0.0.1:8000/api/';

export default {
  async get(endpoint, token) {
    console.log('eeeeeeeee: ',endpoint)
    return axios.get(API_BASE_URL + endpoint, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  async getDatabaseFile(endpoint, token) {
    return axios.get(API_BASE_URL + endpoint, {
      responseType: 'blob',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  async post(endpoint, data, token) {
    return axios.post(API_BASE_URL + endpoint, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  async put(endpoint, data, token) {
    return axios.put(API_BASE_URL + endpoint, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  async delete(endpoint, token) {
    return axios.delete(API_BASE_URL + endpoint, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};
