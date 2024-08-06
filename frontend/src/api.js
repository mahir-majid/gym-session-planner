import axios from 'axios'
import { ACCESS_TOKEN } from './constants'

// Local host testing: backend url: http://127.0.0.1:8000/
// apiUrl: https://gym-workout-manager-production.up.railway.app/
const apiUrl = "http://127.0.0.1:8000/"

const api = axios.create({
    baseURL: apiUrl, 
})

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(ACCESS_TOKEN);

        if(token) {
            config.headers.Authorization = `Bearer ${token}`
        }

        return config;
    },
    (error) => {
        return Promise.reject(error)
    }
)

// use api keyword instead of axios for user-authenticated pages
export default api;