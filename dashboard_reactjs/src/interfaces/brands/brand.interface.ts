export interface IBrand {
    id: number,
    name: string,
    publish: number,
    user_id: {
        id: number,
        name: string
    },
    createdAt: string
}


export interface IBrandRequest {
    name: string,
    userId: number | undefined
}
