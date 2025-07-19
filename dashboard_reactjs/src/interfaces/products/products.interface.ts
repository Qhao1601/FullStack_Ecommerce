import { IBrand } from "../brands/brand.interface"
import { IProductCatalogue } from "./product-catalogues.interface"

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
    brand_id: number,
    brands: IBrand,
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
}
type IProductCatalogueVariant = {
    catalogueId: number
    attributeIds: number[],
    attributeName: string[]

}
// củ
// export interface IProductVariantResponse {
//     id: number
//     uuid: string,
//     userId: number,
//     code?: string,
//     stock: string | number,
//     sku: string,
//     price: number,
//     barcode?: string,
//     publish?: number,
//     attributes: number[],
//     attributeNames: string[],
//     attributeCatalogues: IProductCatalogueVariant[]
// }

export interface IProductVariantResponse {
    id: number
    // uuid: string,
    user_id: number,
    code?: string,
    stock: string | number,
    sku: string,
    price: number,
    barcode?: string | null,
    publish?: number,
    attributes: number[],
    attributeNames: string[],
    attributeCatalogues: IProductCatalogueVariant[]
}

export interface IProductVariant {
    // uuid: string
    userId: number
    code?: string
    stock: string | number
    sku: string
    price: number
    barcode?: string | null
    publish?: number
    attributes: number[]
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
    brand_id: number,
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