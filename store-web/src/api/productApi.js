import axios from 'axios'
import { getEnvVariables } from '../helpers'

const { VITE_API_URL } = getEnvVariables()

export const productApi = axios.create({
  baseURL: 'http://localhost:3000',
})

// DONE: configurar interceptores
productApi.interceptors.request.use(config => {
  config.headers = {
    ...config.headers,
    Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
  }

  return config
})

export default productApi
