import { cartStore } from "@/stores/card.store"

import AppCartItem from "./app-cart-item"


const AppCartItemList = () => {
    const { items } = cartStore()
    return (
        <>
            <div className="mb-6 space-y-6">
                <h2 className="text-[24px] font-bold mb-[20px]">Giỏ hàng</h2>
                {items && items.length > 0 && items.map(item => <AppCartItem key={item.id} item={item} />)}
            </div>
        </>
    )
}


export default AppCartItemList