export interface IAttributeCatalogues {
    id: number
    name: string
    dataType: string
    unit: string | null
    publish: number
    user_id: {
        id: number,
        name: string
    }
}

export interface IAttributeCatalogueRequest {
    name: string
    userId: number | undefined
}


export interface IAttributes {
    id: number
    name: string
    attributeCatalogueId: number
    publish: number
    order: number
    user_id: {
        id: number,
        name: string
    }
    attributeCatalogue: IAttributeCatalogues
}


export interface IAttributesRequest {
    name: string
    attributeCatalogueId: number
    userId: number | undefined
}