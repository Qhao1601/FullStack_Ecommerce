import type { ICustomer } from "./customer.interface"

export interface ILoginResponse {
    accessToken: string,
    expiresAt: number,
    user: ICustomer | null
}
