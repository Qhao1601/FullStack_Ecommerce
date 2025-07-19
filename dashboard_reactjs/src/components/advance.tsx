import {
    Card,
    CardContent,

    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { ISelectOptionItem } from "@/config/constans"
import { ReactElement } from "react"
import { Control, FieldPath, FieldValues } from "react-hook-form"

interface IAdvanceProps<T extends FieldValues> {
    control: Control<T, unknown>
    advance: Array<{
        name: FieldPath<T>,
        data: ISelectOptionItem[],
        placeholder: string
    }>
}

const CartAdvance = <T extends FieldValues>(props: IAdvanceProps<T>): ReactElement => {
    const { control, advance } = props
    return (
        <>
            <Card className="rounded-[5px] pt-[10px] mb-[20px] pb-[15px]">
                <CardHeader className="border-b pt-[0px] custom-padding">
                    <CardTitle className="font-normal uppercase">Cấu hình nâng cao</CardTitle>
                </CardHeader>
                <CardContent className="px-[15px]">
                    {advance && advance.map((item) => (
                        <FormField
                            key={item.name}
                            control={control}
                            name={item.name}
                            render={({ field }) => (
                                <FormItem className="w-full mb-[20px]">
                                    <FormControl>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Chọn trạng thái" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {item.data && item.data.map((option) => (
                                                    <SelectItem key={option.value} value={option.value.toString()}>{option.label}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    ))}

                </CardContent>
            </Card>
        </>
    )
}

export default CartAdvance