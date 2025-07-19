import { AxiosError } from "axios";
import { toast } from "sonner"

import { IApiErrorResponse, IApiResponse, IApiMessageResponse, IApiSuccessResponse } from "@/interfaces/api.response";


export const handleApiError = (error: unknown) => {
    if (error instanceof AxiosError) {
        if (error.response) {
            const errorResponse = error.response.data
            if (errorResponse.message) {
                toast.error(errorResponse.message)
            } else {
                toast.error(`Lỗi: ${errorResponse.status}`)
            }
        } else if (error.request) {
            toast.error('Không nhận được phản hồi từ phía server')
        } else {
            toast.error('Lổi gửi yêu cầu')
        }
    } else {
        toast.error('Lổi không xác định')
    }
}


export const buildUrlWithQueryString = (endpoint: string, queryParams?: Record<string, string>) => {
    const basePath = `${endpoint}`
    if (!queryParams) return basePath;
    const queryString = new URLSearchParams(queryParams).toString()
    return `${basePath}${queryString ? `?${queryString}` : ""}`
}

export const toSlug = (str: string): string => {
    return str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')

}
// export const isSuccessResponse = <T, E>(response: IApiResponse<T, E> | undefined): response is IApiSuccessResponse<T> => {
//     return Boolean(response && 'data' in response && response.status === true)
// }

export const isErrorResponse = <T, E>(response: IApiResponse<T, E> | undefined): response is IApiErrorResponse<E> => {
    return Boolean(response && 'errors' in response && response.status === false)
}

export const isMessageResponse = <T, E>(response: IApiResponse<T, E> | undefined): response is IApiMessageResponse => {
    return Boolean(response && !('data' in response) && !('errors' in response))
}


export const getStatus = (publish: number) => {
    switch (publish) {
        case 1:
            return { text: 'Không hoạt động', className: 'text-red-500' }
            break;
        case 2:
            return { text: 'Hoạt động', className: 'text-green-500' }
            break;
        default:
            return { text: 'Chưa xác định', className: 'text-red-500' }
            break;
    }
}

export const formatPrice = (price: string) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(Number(price))
}

// xử lý lấy file gốc của ảnh
export const getFullImageUrl = function getFullImageUrl(image: string | File | undefined): string {
    if (!image) return '';

    if (typeof image === 'string') {
        // Trường hợp đường dẫn ảnh đã đầy đủ
        if (image.startsWith('http')) return image;

        // Trường hợp chuỗi đã có sẵn "uploads/..."
        if (image.includes('uploads/')) {
            return `${import.meta.env.VITE_BASE_URL}/${image}`;
        }

        // Trường hợp chỉ là tên file
        return `${import.meta.env.VITE_BASE_URL}/uploads/${image}`;
    }

    // Trường hợp là File object (dùng khi người dùng upload ảnh)
    return URL.createObjectURL(image);
};


// bảng dùng riêng của dialog của khuyến mãi
export const isSuccessResponse = <T, E>(response: IApiResponse<T, E> | undefined): response is IApiSuccessResponse<T> => {
    return Boolean(response && 'data' in response && response.status === true)
}