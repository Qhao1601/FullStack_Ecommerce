import { store } from "@/stores"
import { logout, setAuth, setRefreshing } from "@/stores/slices/authSlice"
import { authService } from "./auth.Service"
import { isApiSuccessResponse } from "@/interfaces/api.response"


// biến toàn cục để theo dõi token có đang được làm mới không
let isRefreshing = false
//Lưu trữ thông tin đang thực hiện làm mới token
let refreshPromise: Promise<string | null> | null = null
// thời gian lần làm mới token cuối cùng
let lastRefreshTime = 0
// Khoảng thời gian tối thiểu giữa các lần làm mới token (200ms)
const MIN_REFRESH_INTERVAL = 200

export const refreshTokenService = {
    refreshToken: async (): Promise<string | null> => {
        const now = Date.now()
        if (now - lastRefreshTime < MIN_REFRESH_INTERVAL) {
            console.log('Token đã refresh gần đây k refresh lại')
            return store.getState().auth.accessToken || null
        }

        if (isRefreshing) {
            console.log('đang refresh token ...')
            return refreshPromise
        }

        isRefreshing = true
        store.dispatch(setRefreshing(true))

        refreshPromise = new Promise<string | null>((resolve) => {
            const performRefresh = async () => {
                try {
                    console.log('bắt đầu tiến hành refresh token')
                    const response = await authService.refresh()
                    lastRefreshTime = Date.now()
                    if (response.status === true && response.code === 200 && 'data' in response && isApiSuccessResponse(response)) {
                        console.log('refresh token thành công')
                        store.dispatch(setAuth(response.data))
                        resolve(response.data.accessToken)
                    } else {
                        store.dispatch(logout())
                        window.location.href = '/admin'
                        resolve(null)
                    }
                } catch (error) {
                    console.log('Refresh token không hợp lệ:', error)
                    refreshTokenService.logout()
                    resolve(null)
                } finally {
                    setTimeout(() => {
                        isRefreshing = false,
                            refreshPromise = null,
                            store.dispatch(setRefreshing(false))
                    }, 100)
                }
            }
            performRefresh()
        })
        return refreshPromise
    },

    logout: (): void => {
        store.dispatch(logout())
        refreshPromise = null
        window.location.href = '/admin'
    },


    isTokenValid: (): boolean => {
        const state = store.getState()
        const expiresAt = state.auth.expiresAt
        const isAuthenticated = state.auth.isAuthenticated && !!state.auth.accessToken

        return isAuthenticated && (expiresAt ? expiresAt > Date.now() : false)
    },

    isRefreshing: (): boolean => {
        return isRefreshing
    }
}
