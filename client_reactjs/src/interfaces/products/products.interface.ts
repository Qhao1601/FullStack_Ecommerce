import type { IProductCatalogue } from "./product-catalogues.interface"

export interface IAlbum {
    path: string,
    fullPath: string
}
export interface IProducts {
    id: number,
    name: string,
    canonical: string,
    publish: number,
    creator: string,
    description: string | undefined,
    content: string,
    metaTitle: string,
    metaDescription: string,
    metaKeyword: string,
    level: number,
    brand_id: string,
    made_in?: string,
    price: number,
    price_discount?: number,
    code?: string,
    image: string,
    album: IAlbum[],
    productCatalogueId: string,
    productCatalogues: number[],
    productCatalogue: IProductCatalogue
    productVariants: IProductVariantResponse[]
    pricing: TPricing,
    availableAttributes: availableAttributes[]
}

export type TPricing = {
    originalPrice: number, // giá gốc     
    basePrice?: number, // giá cơ bản  
    promotionDiscount: number,  // giá trị được giảm  
    finalPrice: number, // giá cuối cùng
    discountPercent?: number, // phần trăm giảm
    hasPromotion: boolean,
}


export type availableAttributes = {
    catalogueId: number,
    catalogueName: string,
    attributes: TAttributes[]
}

export type TAttributes = {
    id: number,
    name: string
}


type IProductCatalogueVariant = {
    catalogueId: number
    attributeIds: number[],
    attributeName: string[]

}

export interface IProductVariantResponse {
    id: number
    // user_id: number,
    userId: number
    code?: string,
    stock: string | number,
    sku: string,
    price: number,
    barcode?: string | null,
    publish?: number,
    attributes: number[],
    attributeNames: string[],
    attributeCatalogues: IProductCatalogueVariant[],
    pricing: TPricing,
}

export interface IProductVariant {
    // uuid: string
    id: number,
    userId: number
    code?: string
    stock: string | number
    sku: string
    price: number
    barcode?: string | null
    publish?: number
    attributes: number[],
    attributeNames: string[]
    pricing: TPricing,
}

export interface IProductCreateRequest extends FormData {
    name: string,
    productCatalogueId: string
    publish: number,
    description?: string,
    content?: string,
    metaTitle?: string,
    metaKeyword?: string,
    metaDescription?: string,
    canonical: string,
    brand_id: string,
    made_in?: string,
    price: number,
    price_discount?: number
    code?: string,
    image?: File | undefined | null,
    album?: { path: string }[],
    userId: number | undefined,
    removeImages: string[],
    productCatalogues: number[],
    productVariants: IProductVariant[]
}