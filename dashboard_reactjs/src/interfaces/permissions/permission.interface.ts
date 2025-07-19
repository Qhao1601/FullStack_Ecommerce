export interface IPermission {
    id: number,
    name: string,
    module: string,
    value: number,
    title: string,
    description: string,
    publish: number,
    createdAt: string
    userId: number[]

}


export interface IPermissionRequest {
    name: string,
    module: string,
    value: number,
    title: string,
    description?: string,
    userId: number | undefined
}
