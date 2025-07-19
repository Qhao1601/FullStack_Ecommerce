interface IbaseResponse {
    //status: number, // đã sữa ở dưới
    status: boolean,
    code: number,
    message: string,
    timestamp: string
}

export interface IApiOk<T> extends IbaseResponse {
    data: T
}

export interface IApiError<E> extends IbaseResponse {
    data: E
}

export interface IApiMessage extends IbaseResponse {
    message: string
}

export type IApiResponse<T, E> = IApiOk<T> | IApiError<E> | IApiMessage




export interface ILink {
    url: null | string,
    label: string,
    active: boolean
}

export interface IPaginate<T> {
    current_page: number,
    data: T[],
    first_page_url: string,
    from: number,
    last_page: number,
    last_page_url: string,
    links: ILink[],
    next_page_url: null | string,
    path: string,
    per_page: number,
    prev_page_url: string,
    to: number,
    total: number
}