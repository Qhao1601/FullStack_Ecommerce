import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { IOrder } from "@/interfaces/orders/order.interface"
import { formatPrice } from "@/utils/helper"


interface IOrderConfig {
    children: React.ReactNode,
    order: IOrder
}

export function AppOrderItem({ children, order }: IOrderConfig) {
    return (
        <Dialog>
            <form>
                <DialogTrigger asChild>
                    <Button variant="outline">{children}</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Thông tin chi tiết đơn hàng</DialogTitle>
                        <DialogDescription>
                            Thông tin chi tiết đơn hàng #{order.code}
                        </DialogDescription>
                    </DialogHeader>
                    {/* <div className="grid grid-cols-3 gap-6">
                        <div className="col-span-2 space-y-4">
                            <div>
                                <h3 className="text-base font-bold mb-2 ">Danh sách sản phẩm</h3>
                                <div className="space-y-3">
                                    {order.items && order.items.map((item) => (
                                        <div className="flex gap-4 items-start border rounded-4xl p-[10px]" key={item.id}>
                                            <img className="w-[80px] h-[80px]" src={item.productImage} alt="lổi ảnh" />
                                            <div className="flex-1 text-sm space-y-1">
                                                <div className="font-medium">{item.productName}</div>
                                                <div>Mã sản phẩm:{item.productCode}</div>
                                                <div>Số lượng: {item.quantity}</div>
                                                <div >Giá gốc/Giá bán: <span className="text-red-500 line-through ">{formatPrice(String(item.originalPrice))}</span>{formatPrice(String(item.finalPrice))}</div>
                                                <div>Giảm giá: {formatPrice(String(item.discount))}</div>
                                                <div>Thành tiền:{formatPrice(String(item.finalPrice * item.quantity))}</div>
                                            </div>
                                        </div>
                                    ))}
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span>Tạm tính:{formatPrice(String(order.totalAmount + order.totalDiscount))}</span>

                                        </div>
                                        <div className="flex justify-between">
                                            <span>Khuyến mãi:{formatPrice(String(order.totalDiscount))}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Tạm tính:{formatPrice(String(order.totalAmount))}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div> */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="col-span-1 sm:col-span-2 space-y-4 bg-white shadow-lg rounded-lg p-6 max-h-[500px] overflow-y-auto">
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">Danh sách sản phẩm</h3>
                            <div className="space-y-4">
                                {order.items && order.items.map((item) => (
                                    <div className="flex gap-4 items-start border border-gray-300 rounded-lg p-4 hover:shadow-md transition-all duration-300" key={item.id}>
                                        <img className="w-[80px] h-[80px] object-cover rounded-md" src={item.productImage} alt="lỗi ảnh" />
                                        <div className="flex-1 text-sm text-gray-700 space-y-2">
                                            <div className="font-medium text-gray-900">{item.productName}</div>
                                            <div className="text-gray-500">Mã sản phẩm: {item.productCode}</div>
                                            <div className="text-gray-600">Số lượng: {item.quantity}</div>
                                            <div className="flex items-center space-x-2">
                                                <span className="text-gray-500">Giá gốc:</span>
                                                <span className="text-red-500 line-through">{formatPrice(String(item.originalPrice))}</span>
                                            </div>
                                            <div className="text-lg font-bold text-red-600">Giá bán: {formatPrice(String(item.finalPrice))}</div>
                                            <div className="text-green-500 font-medium">Giảm giá: {formatPrice(String(item.discount))}</div>
                                            <div className="font-semibold text-gray-800">Thành tiền: {formatPrice(String(item.finalPrice * item.quantity))}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-4 mt-6 border-t border-gray-300 pt-4">
                                <div className="flex justify-between text-gray-800 font-medium">
                                    <span>Tạm tính:</span>
                                    <span>{formatPrice(String(order.totalAmount + order.totalDiscount))}</span>
                                </div>
                                <div className="flex justify-between text-gray-800 font-medium">
                                    <span>Khuyến mãi:</span>
                                    <span>{formatPrice(String(order.totalDiscount))}</span>
                                </div>
                                <div className="flex justify-between text-xl font-semibold text-gray-900">
                                    <span>Tổng tiền:</span>
                                    <span>{formatPrice(String(order.totalAmount))}</span>
                                </div>
                            </div>
                        </div>
                    </div>


                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit">Save changes</Button>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    )
}
