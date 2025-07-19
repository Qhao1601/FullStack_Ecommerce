import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { NumericFormat } from "react-number-format"
import { useFormContext } from "react-hook-form"
import { Input } from "./ui/input"



const CarProductInfo = () => {

    const { control } = useFormContext()
    return (
        <>
            <Card className="rounded-[5px] pt-[10px] mb-[20px] pb-[15px]">
                <CardHeader className="border-b pt-[0px] custom-padding">
                    <CardTitle className="font-normal uppercase">thông tin khác</CardTitle>
                </CardHeader>
                <CardContent className="px-[15px]">
                    <FormField
                        control={control}
                        name="code"
                        render={({ field }) => (
                            <FormItem className="mb-[20px]">
                                <FormLabel>Mã sản phẩm</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={control}
                        name="price"
                        render={({ field }) => (
                            <FormItem className="mb-[20px]">
                                <FormLabel>Giá sản phẩm</FormLabel>
                                <FormControl>
                                    <NumericFormat
                                        value={field.value}
                                        onValueChange={(values) => field.onChange(values.floatValue)}
                                        thousandSeparator="."
                                        decimalSeparator=","
                                        allowNegative={false}
                                        className="h-[36px] border border-[#5e5e5e] rounded-[8px] px-[10px] text-[14px] font-medium"
                                        placeholder="Nhập giá sản phẩm"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={control}
                        name="price_discount"
                        render={({ field }) => (
                            <FormItem className="mb-[20px]">
                                <FormLabel>Giá khuyến mãi</FormLabel>
                                <FormControl>
                                    <NumericFormat
                                        value={field.value}
                                        onValueChange={(values) => field.onChange(values.floatValue)}
                                        thousandSeparator="."
                                        decimalSeparator=","
                                        allowNegative={false}
                                        className="h-[36px] border border-[#5e5e5e] rounded-[8px] px-[10px] text-[14px] font-medium"
                                        placeholder="Nhập giá khuyến mãi"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={control}
                        name="made_in"
                        render={({ field }) => (
                            <FormItem className="mb-[20px]">
                                <FormLabel>Xuất xứ</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                </CardContent>
            </Card>
        </>
    )
}
export default CarProductInfo;