import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import * as z from "zod"
import { Button } from "@/components/ui/button";
import { useCurd } from "@/hooks/useCrud";
import { useParams } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import { isApiSuccessResponse } from "@/interfaces/api.response";
import useApi from "@/hooks/useApi"
import { Textarea } from "@/components/ui/textarea"
import { IPromotionCatalogues, IPromotions, IPromotionsRequest } from "@/interfaces/promotions/promotion.interface"
import PromotionTypeRender, { IPromotionDataChange } from "@/components/promotion-type-render"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import DatePicker from "@/components/app-datePicker"



const promotionOrderAmountRangeSchema = z.object({
    key: z.literal('promotionOrderAmountRange'),
    data: z.array(z.object({
        minValue: z.number().min(0, { message: 'Giá trị tối hiểu phải hơn hoặc bằng 0 ' }),
        maxValue: z.number().min(0, { message: 'Giá trị tối đa phải hơn hoặc bằng 0 ' }),
        discountValue: z.number().min(0, { message: 'Giá trị giảm giá phải lớn hơn 0' }),
        discountType: z.enum(['amount', 'percent'], { message: 'Loại giảm giá không hợp lệ' }),
    })).min(1, { message: 'Phải có ít nhất một khoảng giá trị' })
        .refine((ranges) => {
            return ranges.every((range) => range.minValue < range.maxValue)
        }, { message: 'Giá trị tối đa phải lớn hơn giá trị tối thiểu' })
        // kiểm tra trường hợp không cho giao nhau giữa các khoảng giá trị
        // TH1 0 → 100 và TH2 90 → 200 là giao nhau tại 90–100
        .refine((ranges) => {
            const sortRanges = ranges.sort((a, b) => a.minValue - b.minValue);
            for (let i = 0; i < sortRanges.length - 1; i++) {
                if (sortRanges[i].maxValue >= sortRanges[i + 1].minValue) {
                    return false;
                }
            }
            return true;
        }, { message: 'Các khoảng khuyến mãi bị xung đột , vui lòng kiểm tra lại' })
})

const promotionProductComboSchema = z.object({
    key: z.literal('promotionProductCombo'),
    data: z.array(z.object({
        productId: z.number().optional(),
        productVariantId: z.number().optional(),
    }).refine((item) => {
        return item.productId || item.productVariantId;
    })).min(2, { message: 'Phải có ít nhất hai sản phẩm trong combo' })
})

const promotionProductQuantitySchema = z.object({
    key: z.literal('promotionProductQuantity'),
    data: z.array(z.object({
        productId: z.number().optional(),
        productVariantId: z.number().optional(),
        productCatalogue: z.number().optional(),
        minQuantity: z.number().min(1, { message: "Số lượng tối thiểu không hợp lệ" }).optional(),
        maxDiscount: z.number().min(1, { message: "Giá trị giảm giá tối đa không hợp lệ" }).optional(),
        discountValue: z.number().min(1, { message: "Giá trị giảm giá phải lớn  > 0" }).optional(),
        discountType: z.enum(['amount', 'percent']).optional()
    }).refine((item) => {
        return item.productId || item.productVariantId || item.productCatalogue;
    })).min(1, { message: 'Phải có ít nhất một sản phẩm hoặc danh mục sản phẩm' })
})


const PromotionSchema = z.discriminatedUnion('key', [
    promotionOrderAmountRangeSchema,
    promotionProductComboSchema,
    promotionProductQuantitySchema
])

const formConfig = {
    schema: z.object({
        name: z.string().min(1, { message: 'Bạn phải nhập tên khuyến mãi' }),
        code: z.string().min(1, { message: 'Bạn chưa nhập mã khuyến mãi' }),
        description: z.string().optional(),
        promotionCatalogueId: z.number().min(1, { message: "Bạn phải chọn nhóm khuyến mãi" }),
        startDate: z.string().min(1, { message: 'Bạn chưa chọn thời gian bắt đầu khuyến mãi' }),
        endDate: z.string().optional(),
        isDefault: z.number().optional(),
        comboPrice: z.number().optional(),
        defaultDiscountValue: z.number().optional(),
        defaultDiscountType: z.enum(['amount', 'percent']).optional(),
        defaultMinQuantity: z.number().optional(),
        promotionCondition: PromotionSchema
    }),
    defaultValues: {
        name: '',
        code: '',
    },
    createTitle: 'Thêm mới chương trình khuyến mãi',
    updateTitle: 'Chỉnh sửa chương trình khuyến mãi',
    endpoint: '/v1/promotions',
    routerIndex: '/promotions',
    mapToRequest: (values: {
        name: string,
        code: string,
        description?: string,
        promotionCatalogueId: number,
        startDate: string,
        endDate?: string,
        isDefault?: number,
        priority?: number,
        comboPrice?: number,
        defaultDiscountValue?: number,
        defaultDiscountType?: 'amount' | 'percent',
        defaultMinQuantity?: number,
        promotionCondition?: IPromotionDataChange
    }, userId?: number): IPromotionsRequest => ({
        ...values,
        userId
    }),
}


export type TFromValues = z.infer<typeof formConfig.schema>

const PromotionsSave = () => {
    const api = useApi()
    const { id } = useParams()
    const isUpdateMode = !!id
    const formResetRef = useRef<boolean>(false)
    // const { watch } = useFormContext()

    const { onSubmit, form, record } = useCurd<IPromotions, IPromotionsRequest, TFromValues>(formConfig)
    const PromotionCatalogues = api.usePagiante<IPromotionCatalogues[]>('/v1/promotion_catalogues', { soft: 'lft,asc', type: 'all' })

    const [selectPromotionCatalogueId, setSelectPromotionCatalogueId] = useState<number>();

    const [nerveEnd, setNeverEnd] = useState<boolean>(false);

    const startDateValue = form.watch('startDate');
    const endDateValue = form.watch('endDate');

    // render lại data khuyến mãi khi bị reload trang  (củ không cần state isResting , bỏ fieldOnchange)
    useEffect(() => {
        if (record && isApiSuccessResponse(record) && isUpdateMode) {
            const formData = {
                ...record.data,
                promotionCatalogueId: record.data.promotionCatalogueId
            }
            setSelectPromotionCatalogueId(record.data.promotionCatalogueId)
            if (record.data.endDate === 'Không hết hạn') {
                setNeverEnd(true)
            } else {
                setNeverEnd(false)
            }

            setTimeout(() => {
                form.reset(formData as unknown as TFromValues)
                formResetRef.current = true
            }, 200)
        }
    }, [record, isUpdateMode, form])


    // lấy dữ liệu của nhóm khuyến mãi
    const PromotionCatalogueOptions = useMemo(() => {
        if (isApiSuccessResponse(PromotionCatalogues.data)) {
            const data = PromotionCatalogues.data.data as unknown as IPromotionCatalogues[]
            return [
                ...data.map((item) => ({
                    values: item.id.toString(),
                    label: item.name
                }))
            ]
        }
        return []
    }, [PromotionCatalogues])

    // lấy id của nhóm khuyến mãi đã chọn
    const hanlePromotionCatalogueChange = (promotionId: string) => {
        setSelectPromotionCatalogueId(Number(promotionId));
    }


    const handleDateChange = (date: string, field: keyof TFromValues) => {
        if (date != '') {
            if (nerveEnd && field === 'endDate') {
                form.setValue(field, undefined);
            } else {
                form.setValue(field, date);
            }
        }
    }

    const handleDisable = (checked: boolean) => {
        setNeverEnd(checked);
    }


    useEffect(() => {
        const watchValue = form.watch((values, { name, type }) => {
            console.log('watchValue', values);
            console.log('name', name);
            console.log('type', type);
            console.log(form.formState.errors);
        })
        return () => watchValue.unsubscribe();
    }, [form.formState.errors])

    return (
        <>
            <div className="flex flex-1 flex-col gap-4 p-4 bg-[#f3f3f4] pt-[20px]">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="grid grid-cols-12 gap-4">
                            <div className="col-span-9">
                                <Card className="rounded-[5px]">
                                    <CardHeader className="border-b">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <CardTitle>Thông tin chung</CardTitle>
                                                <CardDescription className="text-[#f00000] mt-[5px]">Nhập đầy đủ các trường thông tin bên dưới</CardDescription>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="col-span-1">
                                                <FormField
                                                    control={form.control}
                                                    name="name"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Tên chương trình khuyến mãi</FormLabel>
                                                            <FormControl>
                                                                <Input {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                            <div className="col-span-1">
                                                <FormField
                                                    control={form.control}
                                                    name="code"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Mã khuyến mãi</FormLabel>
                                                            <FormControl>
                                                                <Input {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 mt-[15px]">
                                            <div className="col-span-2">
                                                <FormField
                                                    control={form.control}
                                                    name="description"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Mô tả</FormLabel>
                                                            <FormControl>
                                                                <Textarea className="h-[160px]" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card className="rounded-[5px] mt-[20px]">
                                    <CardHeader className="border-b">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <CardTitle>Cài đặt thông tin chi tiết khuyến mãi</CardTitle>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <FormField
                                            control={form.control}
                                            name="promotionCatalogueId"
                                            render={({ field }) => {
                                                return (
                                                    <FormItem className="w-full">
                                                        <FormLabel>Chọn nhóm khuyến mãi</FormLabel>
                                                        <FormControl>
                                                            <Select disabled={isUpdateMode} onValueChange={(value) => {
                                                                hanlePromotionCatalogueChange(value)
                                                                if (!isUpdateMode) {
                                                                    field.onChange(Number(value))
                                                                }
                                                            }}
                                                                value={field.value?.toString()} >
                                                                <SelectTrigger className="w-full cursor-pointer">
                                                                    <SelectValue placeholder="Chọn nhóm khuyến mãi " />
                                                                </SelectTrigger>
                                                                <SelectContent className="w-full">
                                                                    {PromotionCatalogueOptions && PromotionCatalogueOptions.map((item) => (
                                                                        <SelectItem key={item.values} value={item.values}>{item.label}</SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )
                                            }}
                                        />
                                        <PromotionTypeRender PromotionCatalogueId={selectPromotionCatalogueId} isUpdateModel={isUpdateMode} />
                                    </CardContent>
                                </Card>
                            </div>
                            <div className="col-span-3">
                                <Card className="rounded-[5px]">
                                    <CardHeader className="border-b">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <CardTitle>Thời gian khuyến mãi</CardTitle>
                                                <CardDescription className="text-[#f00000] mt-[5px]">Nhập các thông tin bên dưới</CardDescription>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-1 gap-4">
                                            <div className="col-span-1">
                                                <DatePicker
                                                    onDataChange={(date) => handleDateChange(date, 'startDate')}
                                                    label='Thời gian bắt đầu khuyến mãi'
                                                    className=""
                                                    value={startDateValue}
                                                    isUpdateModel={isUpdateMode}
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 gap-4 mt-[15px]">
                                            <div className="col-span-2">
                                                <DatePicker
                                                    onDataChange={(date) => handleDateChange(date, 'endDate')}
                                                    label='Thời gian kết thúc khuyến mãi'
                                                    className=""
                                                    disable={nerveEnd}
                                                    value={endDateValue}
                                                    isUpdateModel={isUpdateMode}
                                                />
                                            </div>
                                        </div>
                                        <div className="flex items-center mt-[15px]">
                                            <Checkbox checked={nerveEnd} onCheckedChange={handleDisable} className="cursor-pointer" id="nerverEnd" />
                                            <Label className="ml-[10px] cursor-pointer font-normal" htmlFor="nerverEnd">Không bao giờ kết thúc khuyến mãi</Label>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                        <div className="mt-[20px]">
                            <Button type="submit" className="text-[13px] font-light " > Lưu lại</Button>
                        </div>
                    </form>
                </Form>
            </div >
        </>
    )
}

export default PromotionsSave