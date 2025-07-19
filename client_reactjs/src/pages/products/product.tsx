import AppGellery from "@/components/app-gellery"
import AppProductAttributeSelector from "@/components/app-product-attribute-selector"
import AppProductPrice from "@/components/app-product-price"
import AppSafeHtml from "@/components/app-sate-content"
import UseObject from "@/hook/use-object"
import type { IProducts, IProductVariant } from "@/interfaces/products/products.interface"
import { useCallback, useEffect, useState } from "react"
import { useParams } from "react-router"
import { Button } from "@/components/ui/button"
import useCart from "@/hook/use-card"



const Products = () => {
    const params = useParams()
    const { id } = params

    const [selectedVariant, setSelectedVariant] = useState<IProductVariant | null>(null)

    const [productName, setProductName] = useState<string>("")

    const [quantity, setQuantity] = useState<number>(1)

    const { object: product } = UseObject<IProducts>({ id, module: 'products' })
    const { handleAddToCart, cartItems } = useCart()

    // xử lý tên theo biến thể
    useEffect(() => {
        if (product?.name) {
            setProductName(product.name)
        }
    }, [product])


    useEffect(() => {
        console.log(cartItems,)
    }, [cartItems])

    const handlePlus = () => {
        setQuantity(quantity + 1)
    }

    const handleMinus = () => {
        setQuantity(quantity - 1)
    }
    // validate luôn luôn bằng 1 không bao giờ nhập 0 được
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {

        const value = Math.max(1, parseInt(e.target.value, 10) || 0); // Đảm bảo rằng giá trị là số và không nhỏ hơn 1
        setQuantity(value);
    };

    const handleVariantChange = (variant: IProductVariant | null) => {
        console.log('variant đã chọn', variant);
        setSelectedVariant(variant)
        if (variant?.attributeNames.length) {
            const fullProductName = `${product?.name} - ${variant.attributeNames.join(" - ")}`
            setProductName(fullProductName)
        } else {
            setProductName(product?.name || '')
        }
    }

    return (
        <>
            <div id="products" className="py-[40px]">
                <div className="container">
                    <div className="panel-head">
                        <div className="grid grid-cols-2 gap-40">
                            <div className="col-span-1">
                                {product?.album && <AppGellery images={product?.album} />}
                            </div>
                            <div className="col-span-1">
                                {/* <h1 className="entry-title text-[25px] text-gray-900 font-bold">{product?.name}</h1> */}

                                <h1 className="entry-title text-[25px] text-gray-900 font-bold">{productName}</h1>

                                {/*  giá tiền và khuyến mãi */}
                                {(selectedVariant?.pricing || product && product.pricing) && (
                                    <AppProductPrice pricing={(selectedVariant?.pricing || product?.pricing)!} />
                                )}



                                {product?.description && (
                                    <AppSafeHtml html={product.description} className="font-normal" />
                                )}
                                {/*  đổ nhóm thuộc tính và thuộc . group lại những thuộc tính đã chọn */}
                                {product?.availableAttributes && (
                                    <AppProductAttributeSelector product={product} onVariantChange={handleVariantChange} />
                                )}
                                <div className="flex items-center space-x-4 mt-[20px]">
                                    <button
                                        onClick={handleMinus}
                                        className="bg-gray-200 p-2 rounded-md hover:bg-gray-300 transition-colors"
                                    >
                                        -
                                    </button>
                                    <input
                                        type="number"
                                        value={quantity}
                                        onChange={handleChange}
                                        className="w-20 text-center border border-gray-300 rounded-md p-2"
                                        min="1"
                                    />
                                    <button
                                        onClick={handlePlus}
                                        className="bg-gray-200 p-2 rounded-md hover:bg-gray-300 transition-colors"
                                    >
                                        +
                                    </button>
                                </div>
                                <Button className="bg-[#629a23] rounded-[5px] mt-[15px]"
                                    onClick={() => handleAddToCart({ product, selectedVariant, quantity })}>
                                    Thêm giỏ hàng
                                </Button>
                            </div>
                        </div>
                        <div className="panel-body border mt-[30px] p-[20px]">
                            {product?.content && (
                                <AppSafeHtml html={product.content} className="font-normal" />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}


export default Products