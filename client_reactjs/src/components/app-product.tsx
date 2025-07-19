import type { IProducts } from "@/interfaces/products/products.interface"
import { write_url } from "@/utils/helper";
import { memo, useEffect } from "react";
import { Link } from "react-router";
import AppProductPrice from "./app-product-price";

interface IProductItemProps {
    product: IProducts
}

const ProductItem = ({ product }: IProductItemProps) => {

    // const { name, image, pricing } = product

    const name = product.name;
    const image = product.image;
    const pricing = product.pricing;
    const canonicalProduct = write_url(product.canonical, product.id, 'product');

    return (
        <>
            <div className="product-item bg-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-lg overflow-hidden"
                key={product.id}>
                <Link to={canonicalProduct} className="block w-full h-48">
                    <img className="w-full h-full object-cover object-center transition-all duration-300 transform hover:scale-105"
                        src={image} alt={name}
                    />
                </Link>
                <div className="p-4">
                    <h3 className="text-base font-medium text-gray-800 hover:text-[#629d23] line-clamp-2 mb-3">
                        <Link to={canonicalProduct}>
                            {name}
                        </Link>
                    </h3>
                    {/* giá tiền khuyến mãi tách riêng ra */}
                    <AppProductPrice pricing={pricing} />

                    {/* <div className="price-section flex flex-col gap-2">
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
                    </div> */}
                </div>
            </div>
        </>
    )
}


export default memo(ProductItem)