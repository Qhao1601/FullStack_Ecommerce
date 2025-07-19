
import AppPaymentMethod, { type TPaymentMethodData } from "@/components/app-payment-method"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,

} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { Truck } from "lucide-react"

import { useForm } from "react-hook-form"
import { z } from "zod"
import { Wallet } from 'lucide-react';
import AppCartItemList from "@/components/app-cart-item-list"
import AppCartSummary from "@/components/app-cart-summary"
import { Button } from "@/components/ui/button"
import { AuthStore } from "@/stores/auth.stores"
import { toast } from "sonner"
import { useMutation } from "@tanstack/react-query"
import cartService, { type ICheckoutResponse } from "@/services/products/cart.service"
import type { IApiMessage, IApiOk } from "@/interfaces/api.interface"
import type { AxiosError } from "axios"
import { useNavigate } from "react-router"


const checkOutSchema = z.object({
    email: z.string().min(2, {
        message: "Bạn phải nhập địa chỉ email đúng định dạng.",
    }).email(),
    fullname: z.string().min(1, { message: "Bạn phải nhập họ và tên" }),
    phone: z.string().min(8, { message: "Bạn phải nhập số điện thoại" }),
    address: z.string().min(1, { message: "Bạn phải nhập địa chỉ" }),
    paymentMethod: z.enum(['cod', 'paypal'])
})
export type TCartFormRequest = z.infer<typeof checkOutSchema>

const paymentMethodData: TPaymentMethodData[] = [
    {
        id: 1,
        name: "Thanh toán khi nhận hàng",
        icon: <Truck />,
        method: "cod"
    },
    {
        id: 2,
        name: "Thanh toán qua PayPal",
        icon: <Wallet />,
        description: "Chấp nhận mọi thanh toán",
        method: "paypal"
    },
] as const

const DEFAULT_METHOD = 'cod'
const CheckOut = () => {


    const navigate = useNavigate()
    const { isAuthenticated } = AuthStore()

    const form = useForm<TCartFormRequest>({
        resolver: zodResolver(checkOutSchema),
        defaultValues: {
            email: "",
            fullname: "",
            phone: "",
            address: "",
            paymentMethod: 'cod'
        },
    })

    const checkOutMution = useMutation<IApiOk<ICheckoutResponse>, AxiosError<IApiMessage>, TCartFormRequest>({
        mutationFn: cartService.checkout
    })

    const handleCarSubmit = (values: TCartFormRequest) => {

        if (!isAuthenticated()) {
            toast.error('Bạn phải đăng nhập mới được thanh toán')
            return;
        }
        // console.log(values);
        checkOutMution.mutate(values, {
            onSuccess: (response) => {
                if (values.paymentMethod === 'paypal') {
                    const redirectUrl = response.data.original.redirect_url
                    if (redirectUrl && values.paymentMethod === 'paypal') {
                        window.location.href = redirectUrl
                    }
                }
                else {
                    toast.success("Đặt hàng cod thành công")
                    navigate('/paypal/success')
                }
            }
        })
    }

    // useEffect(() => {
    //     console.log(items)
    // }, [items])

    return (
        <>
            <div id="cart-container" className="py-[30px]">
                <div className="container">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleCarSubmit)}>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-1">
                                    <div className="information">
                                        <h2 className="text-uppercase mb-[20px] font-bold text-[25px]">Thông tin vận chuyển</h2>
                                        <div className="panel-body">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="col-span-1">
                                                    <FormField
                                                        control={form.control}
                                                        name="fullname"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>Họ và tên</FormLabel>
                                                                <FormControl>
                                                                    <Input placeholder="Bạn phải nhập họ và tên" {...field} />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                                <div className="col-span-1">
                                                    <FormField
                                                        control={form.control}
                                                        name="phone"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>Số điện thoại</FormLabel>
                                                                <FormControl>
                                                                    <Input placeholder="Bạn phải nhập số điện thoại" {...field} />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                            </div>
                                            <FormField
                                                control={form.control}
                                                name="email"
                                                render={({ field }) => (
                                                    <FormItem className="mt-[15px]">
                                                        <FormLabel>Email</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Bạn phải nhập email" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="address"
                                                render={({ field }) => (
                                                    <FormItem className="mt-[15px]">
                                                        <FormLabel>Địa chỉ</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Bạn phải nhập địa chỉ" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>
                                    <div className="payment-method">
                                        <h2 className="text-uppercase mb-[20px] font-bold text-[25px]">Hình thức thanh toán</h2>
                                        <div className="panel-body">
                                            <FormField
                                                control={form.control}
                                                name="paymentMethod"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Ghi chú</FormLabel>
                                                        <FormControl>
                                                            <AppPaymentMethod
                                                                data={paymentMethodData}
                                                                defaultValues={DEFAULT_METHOD}
                                                                value={field.value}
                                                                onChange={field.onChange}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <div className="panel-foot mt-[20px]">
                                            * Nếu bạn không hài lòng sản phẩm của tôi , bạn có thể trả sản phẩm <span className="text-blue-600">tại đây </span>
                                        </div>
                                        <div className="flex justify-end mt-[20px]">
                                            <Button type="submit" className="rounded-[5px] bg-[#629a23] cursor-pointer font-normal text-white">
                                                Thanh toán
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-span-1">
                                    {/* hiển thị sp giỏ hàng */}
                                    <AppCartItemList />
                                    {/* giá tiền giỏ hàng */}
                                    <AppCartSummary />
                                </div>
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
        </>
    )
}

export default CheckOut