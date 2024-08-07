import axios from 'axios'

const apiNinjasClient = axios.create({
  baseURL: `${window.location.protocol}//${window.location.hostname}/v1`,
  headers: {
    'X-Api-Key': import.meta.env.VITE_API_NINJAS_KEY as string,
    'Content-Type': 'application/json',
  },
})

export default apiNinjasClient
