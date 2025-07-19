import type { IApiMessage, IApiOk } from "@/interfaces/api.interface"
import type { IProducts, IProductVariant } from "@/interfaces/products/products.interface"
import { cartService, type IAddCartItemRequest, type ISyncCartReponse } from "@/services/products/cart.service"
import { AuthStore } from "@/stores/auth.stores"
import { cartStore } from "@/stores/card.store"
import { useMutation } from "@tanstack/react-query"
import type { AxiosError } from "axios"
import { toast } from "sonner"
export interface IAddToCartParams {
    product: IProducts | null,
    selectedVariant?: IProductVariant | null,
    quantity: number
}

const useCart = () => {

    const { addItem, items, summary, removeItem, update, clearCart } = cartStore()

    const addItemMuatation = useMutation<IApiOk<ISyncCartReponse>, AxiosError<IApiMessage>, IAddCartItemRequest>({
        mutationFn: cartService.addItem
    })

    const handleAddToCart = async ({ product, selectedVariant, quantity }: IAddToCartParams) => {
        if (!product) {
            toast.error("Không có sản phẩm để thêm vào giỏ hàng")
            return
        }


        if (quantity <= 0) {
            toast.error("Số lượng sản phẩm phải lớn hơn 0")
            return
        }
        const hasVariant = product.availableAttributes && product.availableAttributes.length > 0
        if (hasVariant) {
            if (!selectedVariant) {
                toast.error("Bạn phải chọn phiên bản của sản phẩm muốn mua")
                return
            }

            console.log("Thêm sản phẩm vào giỏ hàng thành công", {
                product: product.id,
                variantId: selectedVariant.id,
                quantity,
                price: selectedVariant.pricing.finalPrice,
                promotionDiscount: selectedVariant.pricing.promotionDiscount || 0
            });
            addItem(product, quantity, selectedVariant)
            toast.success("Thêm vào giỏ hàng thành công")
        }
        else {
            console.log('Thêm sản phẩm không phiên bản vào giỏ hàng thành công', {
                productId: product.id,
                price: product.pricing.finalPrice,
                discount: product.pricing.promotionDiscount,
                quantity: quantity
            })
            addItem(product, quantity, null)
            toast.success("Thêm vào giỏ hàng thành công(k phiên bản)")
        }
        if (AuthStore.getState().isAuthenticated()) {
            addItemMuatation.mutate({
                productId: product.id,
                variantId: selectedVariant?.id,
                quantity: quantity,
                selectedAttributes: selectedVariant?.attributeNames.map((name, index) => ({
                    catalogueId: 0,
                    catalogueName: '',
                    attributeId: selectedVariant.attributes?.[index] || 0,
                    attributeName: name
                })) || []
            })
        }
    }

    const handleRemoveFromCart = (itemId: string) => {
        removeItem(itemId)
    }

    const handleUpdateCart = (itemId: string, quantity: number) => {
        update(itemId, quantity)
    }

    const handleClearAllCart = () => {
        clearCart()
        toast.success("Xóa toàn bộ giỏ hàng thành công")
    }


    return {
        handleAddToCart,
        handleRemoveFromCart,
        handleUpdateCart,
        handleClearAllCart,

        //state
        cartItems: items,
        cartSummary: summary,
        cartTotalItems: summary.totalItems,
        cartQuantity: summary.toltalQuantity

    }



}


export default useCart