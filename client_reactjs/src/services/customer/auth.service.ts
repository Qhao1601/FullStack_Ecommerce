import type { IApiMessage, IApiOk } from "@/interfaces/api.interface";
import type { ILoginResponse } from "@/interfaces/auth.interface";
import type { TLoginRequest, TRegisterRequest } from "@/components/header";
import { privateApi, publicApi } from "@/config/axios";
import type { ICustomer } from "@/interfaces/customer.interface";

const ENDPOINT = 'v1/customer/auth'

const authService = {
    signin: async (payload: TLoginRequest): Promise<IApiOk<ILoginResponse>> => {
        const response = await publicApi.post(`${ENDPOINT}/authenticate`, payload);
        return response.data;
    },
    logout: async (): Promise<IApiMessage> => {
        const response = await privateApi.post(`${ENDPOINT}/logout`);
        return response.data;
    },

    register: async (payload: TRegisterRequest): Promise<IApiOk<ICustomer>> => {
        console.log(9999);
        const response = await publicApi.post(`${ENDPOINT}/register`, payload);
        return response.data;
    }



}

export default authService