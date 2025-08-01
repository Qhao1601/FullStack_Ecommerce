

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



export interface IProductCatalogueRequest {
    name: string,
    parentId: string,
    publish: string,
    description?: string,
    content?: string,
    metaTitle?: string,
    metaKeyword?: string,
    metaDescription?: string,
    canonical: string,
    image?: File | undefined | null,
    // album?: File[]
    album?: { path: string }[],
    userId: number | undefined,
    removeImages: string[]
}