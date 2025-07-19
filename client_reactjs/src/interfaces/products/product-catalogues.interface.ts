import type { IProducts } from "./products.interface"

export interface IAlbum {
    path: string,
    fullPath: string
}

export interface IProductCatalogue {
    id: number,
    name: string,
    canonical: string,
    parentId: string,
    publish: number,
    creator: string,
    description: string,
    content: string,
    metaTitle: string,
    metaDescription: string,
    metaKeyword: string
    level: number,
    image: string,
    album: IAlbum[],

}


export interface IProductCatalogueHome extends IProductCatalogue {
    products: IProducts[]
}