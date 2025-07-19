import axios, { AxiosError } from "axios";
import { store } from "@/stores";
import { setRefreshing } from "@/stores/slices/authSlice";
import { refreshTokenService } from "@/services/auth/refresh-token.service";
import { useQueryClient } from "@tanstack/react-query";


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
    // xử lý refest token
    // với cookie thì không cần thiết lập lại cookie
    withCredentials: true,
})

privateApi.interceptors.request.use(
    (config) => {
        const state = store.getState()
        const accessToken = state.auth.accessToken
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

// tạo hàng đợi nếu đang request
let failedQueue: Array<{
    resolve: (value: string | null) => void,
    reject: (reason?: unknown) => void
}> = []

const processQueue = (error: unknown, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error)
        } else {
            prom.resolve(token)
        }
    })
    failedQueue = []
}


publicApi.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        return Promise.reject(error)
    }
)

privateApi.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config
        if (!originalRequest) return Promise.reject(error)
        if (error.response?.status === 401 &&
            !originalRequest._retry &&
            !originalRequest?.url?.includes('/v1/auth/refresh-token')
        ) {
            originalRequest._retry = true
            const isRefreshing = refreshTokenService.isRefreshing()
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject })
                }).then((token) => {
                    const queryClient = useQueryClient()
                    if (token && originalRequest) {
                        originalRequest.headers.Authorization = `Bearer ${token}`
                        queryClient.invalidateQueries()
                        return privateApi(originalRequest)
                    }
                    return Promise.reject(error)
                }).catch((err) => Promise.reject(err))
            }
            try {
                const newToken = refreshTokenService.refreshToken()

                if (newToken) {
                    const queryClient = useQueryClient()
                    originalRequest.headers.Authorization = `Bearer ${newToken}`
                    processQueue(null, newToken.toString())
                    queryClient.invalidateQueries()
                    return privateApi(originalRequest)
                }
                throw new Error("Refresh thất bại")

            } catch (refreshError) {
                processQueue(refreshError, null)
                return Promise.reject(refreshError)
            } finally {
                store.dispatch(setRefreshing(false))
            }
        }


        return Promise.reject(error)
    }
)