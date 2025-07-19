import { publicApi } from "@/config/axios";

import type { IPaginate, IApiOk } from "@/interfaces/api.interface"

const PREFIX = 'v1/public'
export const baseService = {
    paginate: async<T>(endpoint: string): Promise<IApiOk<T[] | IPaginate<T>>> => {
        const response = await publicApi.get(`${PREFIX}/${endpoint}`)
        if ('data' in response.data) {
            return response.data
        }
        throw response
    },
    show: async<T>(endpoint: string, id: number): Promise<IApiOk<T>> => {
        const resonse = await publicApi.get(`${PREFIX}/${endpoint}/${id}`)
        if ('data' in resonse) {
            return resonse.data
        }
        throw resonse
    }
}