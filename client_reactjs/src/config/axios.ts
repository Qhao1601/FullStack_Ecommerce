import { AuthStore } from "@/stores/auth.stores";
import axios, { AxiosError } from "axios";

declare module 'axios' {
    export interface InternalAxiosRequestConfig {
        _retry?: boolean
    }
}

export const publicApi = axios.create({
    baseURL: '/api',
    timeout: 10000,
    headers: {
        'content-Type': 'application/json',
    },
    withCredentials: true,
})

export const privateApi = axios.create({
    baseURL: '/api',
    timeout: 10000,
    headers: {
        'content-Type': 'application/json',
    },
    withCredentials: true,
})

privateApi.interceptors.request.use(
    (config) => {

        const { accessToken } = AuthStore.getState()
        if (!accessToken) {
            return Promise.reject(new Error('Không có access token'))
        }
        config.headers.Authorization = `Bearer ${accessToken}`

        /** FORMDATA */
        if (config.data instanceof FormData) {
            config.headers["Content-Type"] = 'multipart/form-data'
        } else {
            config.headers["Content-Type"] = 'application/json'
        }


        return config;
    },
    (error) => {
        return Promise.reject(error)
    }
)

publicApi.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        return Promise.reject(error)
    }
)

privateApi.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        return Promise.reject(error)
    }
)