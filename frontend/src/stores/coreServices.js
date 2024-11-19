import axios from 'axios';
import { getCookie } from '@/utils/cookieManager';

export function coreServices() {
  return {
    baseUrl() { return `${import.meta.env.VITE_APP_BASE_URL}/api`; },
    createUrl(url) {
      if (url.startsWith('http')) return url;
      return `${this.baseUrl()}${url}`;
    },
    async get(url) {
      return axios.get(this.createUrl(url), { headers: this.getRequestHeader() });
    },
    async downloadBlob(url, data) {
      return axios.post(this.createUrl(url), data, { headers: this.getRequestHeader(), responseType: 'blob' });
    },
    async post(url, data, headers) {
      return axios.post(this.createUrl(url), data, { headers: headers });
    },
    async put(url, data) {
      return axios.put(this.createUrl(url), data, { headers: this.getRequestHeader() });
    },
    async patch(url, data) {
      return axios.patch(this.createUrl(url), data, { headers: this.getRequestHeader() });
    },
    async delete(url) {
      return axios.delete(this.createUrl(url), { headers: this.getRequestHeader() });
    },
    getRequestHeader() {
      const accessToken = getCookie('accessToken');
      return {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      };
    },
    getMultipartRequestHeader() { /* TODO: simplify with last method */
      const accessToken = getCookie('accessToken');
      return {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'multipart/form-data',
      };
    },
  };
}
