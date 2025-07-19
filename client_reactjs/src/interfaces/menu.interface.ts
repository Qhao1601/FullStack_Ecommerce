

export interface IMenu {
    id: number,
    name: string,
    canonical: string,
    icon: string,
    parentId: number,
    publish: number
    children?: IMenu[]
}