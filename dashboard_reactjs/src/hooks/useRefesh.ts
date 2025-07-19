import { IApiResponse } from "@/interfaces/api.response";
import { ILoginResponse } from "@/interfaces/auth/auth.interface";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { store, useAppDispatch, useAppSelector } from "@/stores";
import { useNavigate } from "react-router-dom";
import { logout, setRefreshing } from "@/stores/slices/authSlice";
import { refreshTokenService } from "@/services/auth/refresh-token.service";


export const useRefesh = () => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const isRefreshing = useAppSelector((state) => state.auth.isRefreshing)

    const [isRefreshSuccessful, setRefreshSuccessful] = useState<boolean | null>(null)

    const refreshToken = useMutation<IApiResponse<ILoginResponse, unknown>, Error, unknown>(
        {
            mutationFn: async () => {
                setRefreshSuccessful(true)
                const newToken = refreshTokenService.refreshToken()
                if (!newToken) {
                    throw new Error("refresh token thất bại")
                }
                const state = store.getState()
                return {
                    status: true,
                    code: 200,
                    data: {
                        accessToken: state.auth.accessToken!,
                        expiresAt: state.auth.expiresAt ? (state.auth.expiresAt - Date.now()) / 1000 : 3600,
                        user: state.auth.user
                    },
                    message: 'Success',
                    timestamp: Date.now().toString()
                }
            },
            onMutate: () => {
                dispatch(setRefreshing(true))
                setRefreshSuccessful(null)
            },// ch hiểu

            onError: (error) => {
                console.log("Refresh Token failed: ", error)
                dispatch(logout())
                setRefreshSuccessful(false)
                navigate('/admin', { replace: true })
            },
            onSettled: () => {
                dispatch(setRefreshing(true))
            }
        })
    return {
        refreshToken,
        isRefreshing,
        isRefreshSuccessful,
        isLoading: refreshToken.isPending,
        error: refreshToken.error
    }
}