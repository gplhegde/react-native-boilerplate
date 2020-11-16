import axios, { AxiosInstance } from 'axios'
import { Config } from '@/Config'

const instance: AxiosInstance = axios.create({
    baseURL: Config.API_URL,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
    timeout: 3000,
})

export type RequestError = {
    message: string;
    data?: any;
    status?: number;
}

export const handleError = ({ message, data, status }: RequestError) => {
    return Promise.reject({ message, data, status })
}

instance.interceptors.response.use(
    (response) => response,
    ({ message, response: { data, status } }) => {
        return handleError({ message, data, status })
    },
)

export default instance
