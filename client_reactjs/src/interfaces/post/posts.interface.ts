
export interface IPostCatalogue {
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
    creatAt: string,
    posts: IPosts[]
}



export interface IPosts {
    id: number,
    name: string,
    canonical: string,
    publish: number,
    creator: string,
    description: string,
    content: string,
    metaTitle: string,
    metaDescription: string,
    metaKeyword: string
    level: number,
    image: string,
    creatAt: string,
    postCatalogueId: string,
    postCatalogues: number[],
    postCatalogue: IPostCatalogue
}


export interface IAlbum {
    path: string,
    fullPath: string
}


