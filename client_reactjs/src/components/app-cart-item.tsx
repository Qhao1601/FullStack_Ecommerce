import type { ICartItem } from "@/stores/card.store"
import { formatPrice } from "@/utils/helper"
import { Trash } from "lucide-react"
import { Input } from "./ui/input"
import { cartStore } from "@/stores/card.store"



interface IAppCartItem {
    item: ICartItem
}


const AppCartItem = ({ item }: IAppCartItem) => {

    const { update, removeItem } = cartStore()

    const handleChange = (id: string, value: number) => {
        // if (value >= 11) {
        //     toast.error("lien he ch")
        //     return;
        // }
        if (value >= 1) {
            update(id, value)
        }
    }

    const handleIncrease = (id: string, quantity: number) => {
        // if (item.quantity >= 5) {
        //     toast.error("Số lượng quá nhiều liê hệ shop")
        //     return;
        // }
        handleChange(id, quantity + 1)
    }


    const handleDecrease = (id: string, quantity: number) => {
        if (quantity > 1) {
            handleChange(id, quantity - 1)
        }
    }

    const handleRemoveItem = () => {
        removeItem(item.id)
    }


    return (
        <>
            <div key={item.id} className="flex gap-4 border-b pb-4">
                <div className="w-[100px] h-[100px] overflow-hidden rounded-lg border cursor-pointer">
                    <img src={item.productImage} alt="" key={item.productImage} />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                    <div >
                        <h3 className="font-semibold text-[16px]">{item.productName}</h3>
                        <p className="text-sm text-muted-foreground">
                            {item.selectedAttributes && item.selectedAttributes.map(attr => attr.attributeName).join(' / ')}
                        </p>
                    </div>
                    <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => handleDecrease(item.id, item.quantity)}
                                className="size-6 rounded-full bg-gray-200 cursor-pointer"
                                type="button">
                                -
                            </button>
                            <Input
                                className="w-14 px-2 py-1 rounded-e-md text-center border"

                                onChange={(e) => handleChange(item.id, Number(e.target.value))}
                                value={item.quantity}
                            />
                            <button
                                onClick={() => handleIncrease(item.id, item.quantity)}
                                className="size-6 rounded-full bg-gray-200 cursor-pointer"
                                type="button">
                                +
                            </button>
                        </div>
                        <span className="text-[16px] font-bold text-right ml-auto">
                            {formatPrice(String(item.finalPrice))}

                            {item.discount > 0 && (
                                <span className="line-through text-sm text-gray-500 ml-1 font-normal">
                                    {formatPrice(String(item.originalPrice))}
                                </span>
                            )}

                        </span>
                        <button onClick={handleRemoveItem} type="button" className="text-sm text-gray-500 hover:text-red-500 cursor-pointer">
                            <Trash size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </>

    )
}


export default AppCartItem