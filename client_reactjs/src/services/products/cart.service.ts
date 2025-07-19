import { privateApi } from "@/config/axios";
import type { IApiMessage, IApiOk } from "@/interfaces/api.interface";
import type { ICartItem, ICartSummary, TSelectedAttributes } from "@/stores/card.store";


export interface ISyncCartReponse {
    items: ICartItem[],
    summary: ICartSummary
}

export interface IAddCartItemRequest {
    productId: number,
    variantId?: number,
    quantity: number,
    selectedAttributes: TSelectedAttributes[]
}


export interface IUpdateCartItemRequest {
    quantity: number
}

export interface ICheckoutResponse {
    original: {
        redirect_url: string
    }
}


const BASE_URL: string = 'v1/cart'

export const cartService = {
    // thêm giỏ hàng
    addItem: async (data: IAddCartItemRequest): Promise<IApiOk<ISyncCartReponse>> => {
        const reponse = await privateApi.post(`${BASE_URL}/item`, data)
        if ('data' in reponse) {
            return reponse.data
        }
        throw reponse
    },
    // sửa giỏ hàng
    updateItem: async (itemId: string, data: IUpdateCartItemRequest): Promise<IApiOk<ISyncCartReponse>> => {
        const reponse = await privateApi.put(`${BASE_URL}/item/${itemId}`, data)
        if ('data' in reponse) {
            return reponse.data
        }
        throw reponse
    },
    // cập nhật sản phẩm thêm vào giỏ hàng cập nhật qua server cho đồng bộ
    syncCart: async (items: ICartItem[]): Promise<IApiOk<ISyncCartReponse>> => {
        const reponse = await privateApi.post(`${BASE_URL}/sync`, { items })
        if ('data' in reponse) {
            return reponse.data
        }
        throw reponse
    },
    // lấy ra giỏ hàng
    getCart: async (): Promise<IApiOk<ISyncCartReponse>> => {
        const reponse = await privateApi.get(`${BASE_URL}`)
        if ('data' in reponse) {
            return reponse.data
        }
        throw reponse
    },
    // xóa 1 sản phẩm xóa hàng
    removeItem: async (itemId: string): Promise<IApiOk<ISyncCartReponse>> => {
        const reponse = await privateApi.delete(`${BASE_URL}/item/${itemId}`)
        if ('data' in reponse) {
            return reponse.data
        }
        throw reponse
    },
    // xóa toàn bộ giỏ hàng
    clearCart: async (): Promise<IApiOk<ISyncCartReponse>> => {
        const reponse = await privateApi.delete(`${BASE_URL}`)
        if ('data' in reponse) {
            return reponse.data
        }
        throw reponse
    },

    // nếu ng dùng ch đăng nhập thêm vào giỏ hàng , sau đó đăng nhập thì merge lại đồng bộ lại giỏ hàng cho ng vừa đăng nhập
    mergeCart: async (requestItems: ICartItem[]): Promise<IApiOk<ISyncCartReponse>> => {
        const reponse = await privateApi.post(`${BASE_URL}/merge`, { requestItems })
        if ('data' in reponse) {
            return reponse.data
        }
        throw reponse
    },

    // thanh toán
    checkout: async<P>(payload: P): Promise<IApiOk<ICheckoutResponse>> => {
        const response = await privateApi.post(`${BASE_URL}/checkout`, payload)
        return response.data
    },
    // xử lý url của paypal
    paypalExecute: async (token: string | null, payerId: string | null, orderId: string | null): Promise<IApiOk<IApiMessage>> => {
        const response = await privateApi.post('/paypal/execute', { token, payerId, orderId })
        return response.data
    }

}

export default cartService
