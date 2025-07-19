import { cartStore } from "@/stores/card.store"
import { formatPrice } from "@/utils/helper";
import { memo } from "react";


const AppCartSummary = () => {
    const { summary } = cartStore()
    return (
        <>
            <div className="mt-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                <h2 className="text-lg font-semibold mb-4">Chi tiết thanh toán</h2>
                <div className="flex justify-between py-2 text-sm">
                    <span>Tạm tính</span>
                    <span>{formatPrice(String(summary.totalAmount + summary.totalDiscount))}</span>
                </div>
                <div className="flex justify-between py-2 text-sm">
                    <span>Giảm giá</span>
                    <span className="text-sm text-red-500">-{formatPrice(String(summary.totalDiscount))}</span>
                </div>
                <div className="flex justify-between py-2 font-bold text-base">
                    <span>Thành tiền</span>
                    <span className="font-bold text-[14px] text-gray-900">{formatPrice(String(summary.totalAmount))}</span>
                </div>
            </div>
        </>
    )
}


export default memo(AppCartSummary)