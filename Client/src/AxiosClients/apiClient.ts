import axios from 'axios'

const apiClient = axios.create({
    baseURL: `${import.meta.env.VITE_REACT_APIGATEWAY_URL}/api`,
})

export const setAuthToken = (token: string) => {
    if (token) {
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`
    } else {
        delete apiClient.defaults.headers.common['Authorization']
    }
}

export default apiClient
