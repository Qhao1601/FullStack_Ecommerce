import type { TPricing } from "@/interfaces/products/products.interface"
import { formatPrice } from "@/utils/helper"
import { memo } from "react"

interface IProductPriceProps {
    pricing: TPricing
}

const AppProductPrice = ({ pricing }: IProductPriceProps) => {
    return (
        <>
            <div className="price-section flex flex-col gap-2">
                <div className="flex items-center gap-3 mb-3">
                    <div className="finalPrice text-red-600 font-bold text-lg">
                        {formatPrice(pricing.finalPrice.toString())}
                    </div>
                    {pricing.hasPromotion && (
                        <div className="discount-badge bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                            -{pricing.discountPercent}%
                        </div>
                    )}
                </div>
                {pricing.hasPromotion && (
                    <div className="flex items-center gap-2">
                        <div className="origin-price text-gray-500 line-through text-sm">
                            {formatPrice(pricing.originalPrice.toString())}
                        </div>
                        <div className="save-amount text-green-500 text-xs">
                            Tiết kiệm {formatPrice(pricing.promotionDiscount.toString())}
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}


export default memo(AppProductPrice)