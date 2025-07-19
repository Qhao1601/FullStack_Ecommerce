import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import type { JSX } from "react"
import { memo } from "react"

export type TPaymentMethodValue = 'cod' | 'paypal'

export type TPaymentMethodData = {
    id: number,
    name: string,
    icon: JSX.Element,
    description?: string,
    method: string
}

interface IPaymentMethod {
    data: TPaymentMethodData[],
    defaultValues?: TPaymentMethodValue,
    value?: TPaymentMethodValue,
    onChange?: (value: TPaymentMethodValue) => void
}

const AppPaymentMethod = ({ data, defaultValues, value, onChange }: IPaymentMethod) => {

    return (
        <div className="payment-method-container">
            <RadioGroup value={value} onValueChange={onChange} defaultValue={defaultValues}>
                {data && data.map((payment) => (
                    <div key={payment.id} className="flex items-center space-x-2 cursor-pointer gap-2 rounded-xl border border-neutral-200 px-4 py-2">
                        <RadioGroupItem value={payment.method} id={payment.method} />
                        <Label htmlFor={payment.method} className="cursor-pointer">
                            <div className="flex items-center">
                                <span className="mr-[35px] ml-[10px]">{payment.icon}</span>
                                <div>
                                    <div className="text-[15px] font-bold">
                                        {payment.name}
                                    </div>
                                    {payment && <div className="font-normal text-[12px] mt-[10px]">{payment.description}</div>}
                                </div>
                            </div>
                        </Label>
                    </div>
                ))}

            </RadioGroup>
        </div >
    )

}

export default memo(AppPaymentMethod)