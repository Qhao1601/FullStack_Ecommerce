

export interface IOrder {
    id: number,
    customerId: number,
    code: string,
    fullname: string,
    phone: string,
    email: string,
    address: string,
    description: string,
    paymentMethod: TPaymentMethod
    status: TStatus,
    subTotal: number,
    totalDiscount: number,
    totalAmount: number,
    totalQuantity: number,
    totalItems: number,
    paidAt: string,
    createdAt: string,
    updatedAt: string,
    items: IOrderItem[]
}

export interface IOrderItem {
    id: number
    orderId: number
    productId: number,
    productVariantId?: number,
    productName: string,
    productImage: string,
    productCode: string,
    variantSku?: string,
    quantity: number,
    originalPrice: number,
    finalPrice: number,
    discount: number,
    selectedAttributes: TSelectedAttributes[]
}


export type TPaymentMethod = 'cod' | 'paypal'
export type TStatus = 'pending' | 'paid' | 'failed' | 'canceled' | 'success'
export type TSelectedAttributes = {
    catalogueId: number,
    catalogueName: string,
    attributeId: number,
    attributeName: string
}