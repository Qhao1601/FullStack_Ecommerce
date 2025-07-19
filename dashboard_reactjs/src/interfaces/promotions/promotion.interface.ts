import { IPromotionDataChange } from "@/components/promotion-type-render"


export interface IPromotionCatalogues {
    id: number
    name: string
    canonical: string
    publish: number
    user_id: {
        id: number,
        name: string
    }
}

export interface IPromotionCatalogueRequest {
    name: string
    userId: number | undefined
}


export interface IPromotions {
    id: number
    name: string
    code: string
    comboPrice: number | undefined
    priority: number,
    description: string
    defaultDiscountValue: number | undefined,
    defaultDiscountType: 'amount' | 'percent' | undefined,
    defaultMinQuantity: number | undefined,
    isDefault: number,
    usage_count: number,
    startDate: string,
    endDate: string,
    publish: number,
    users: string,
    promotionCatalogues: IPromotionCatalogues,
    promotionCatalogueId: number
}

export interface IPromotionsRequest {
    name: string
    code: string
    userId: number | undefined,
    priority?: number,
    promotionCatalogueId: number,
    startDate: string,
    endDate?: string,
    comboPrice?: number,
    description?: string,
    isDefault?: number | undefined,
    defaultDiscountValue?: number,
    defaultDiscountType?: 'amount' | 'percent',
    defaultMinQuantity?: number,
    promotionCondition?: IPromotionDataChange
}