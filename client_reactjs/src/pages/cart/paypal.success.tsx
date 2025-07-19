import { Button } from "@/components/ui/button"
import type { IApiMessage } from "@/interfaces/api.interface"
import cartService from "@/services/products/cart.service"
import { cartStore } from "@/stores/card.store"
import { useMutation } from "@tanstack/react-query"
import type { AxiosError } from "axios"
import { CheckCircle, XCircle } from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router"
import { toast } from "sonner"





// xử lý thanh toán paypal
const PaypalSuccess = () => {

    const navigate = useNavigate()
    const { clearCart } = cartStore()
    const [status, setStatus] = useState<'pending' | 'success' | 'error'>('pending')

    const [searchParams] = useSearchParams();

    const token = searchParams.get('token');
    const payerId = searchParams.get('PayerID');
    const orderId = searchParams.get('orderId');

    const paypalExecuteMution = useMutation<IApiMessage, AxiosError<IApiMessage>, { token: string | null, payerId: string | null, orderId: string | null }>({
        mutationFn: () => cartService.paypalExecute(token, payerId, orderId)
    })

    useEffect(() => {
        if (token && payerId) {
            paypalExecuteMution.mutate({ token, payerId, orderId }, {
                onSuccess: () => {
                    setStatus('success')
                    clearCart()
                    toast.success("Thanh toán đơn hàng qua paypal thành công")
                },
                onError: () => {
                    setStatus('error')
                    toast.error("Thanh toán đơn hàng qua paypal thất bại")
                }
            })
        } else {
            clearCart()
            setStatus('success')
        }
    }, [token, payerId, orderId])


    return (
        <>
            <div className="min-h[480px] flex flex-col justify-center items-center text-center py-10">
                {status === 'pending' && (<p>Đang xử lý thanh toán , vui lòng đợi trong giây lát ....</p>)}

                {status === 'success' && (
                    <div >
                        <CheckCircle size={60} className="bg-[#629a23] mb-[4px] mx-auto " />
                        <h2 className="font-semibold text-2xl mb-2">Đặt hàng thành công</h2>
                        <p>Cảm ơn bạn đã đặt hàng. Chúng tôi sẽ xử lý đơn hàng sớm nhất có thể</p>
                        <Button className="bg-[#629a23] text-white font-normal" onClick={() => navigate('/')}>Quay trở về trang chủ</Button>
                    </div>
                )}

                {status === 'error' && (
                    <div>
                        <XCircle size={60} className="bg-red-600 mx-auto mb-[4px]" />
                        <h2 className="font-semibold text-2xl mb-2">Đặt hàng thất bại</h2>
                        <p>Có vấn đề xảy ra. Vui lòng chờ trong giây lát. Chúng tôi sẽ xử lý đơn hàng sớm nhất có thể</p>
                        <Button className="bg-[#629a23] text-white font-normal" onClick={() => navigate('/')}>Quay trở về trang chủ</Button>
                    </div>
                )}

            </div>
        </>
    )
}


export default PaypalSuccess