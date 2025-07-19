import React, { memo, useCallback, useEffect, useRef, useState } from "react"
import { NumericFormat } from "react-number-format"
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select"
import { Button } from "./ui/button"
import ProductSelectorDialog from "./product-selector-dialog"
import { selectedProductDiglog, SelectedItem } from "./product-selector-dialog"
import { formatPrice } from "@/utils/helper"
import { Checkbox } from "./ui/checkbox"
import { Label } from "./ui/label"
import { Trash2, Plus } from "lucide-react"
import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form"
import { useFormContext } from "react-hook-form"





interface IPromotionTypeRender {
    PromotionCatalogueId: number | undefined,
    isUpdateModel: boolean
}


interface IndividualDiscount {
    productId?: number,
    productVariantId?: number,
    minQuantity: number,
    maxDiscount: number,
    discountValue: number,
    discountType: 'amount' | 'percent'
}


interface IpriceRange {
    id: string,
    fromPrice: string,
    toPrice: string,
    discount: string,
    type: 'amount' | 'percent'
}





type TpromotionOrderAmountRange = {
    minValue: number,
    maxValue: number,
    discountValue: number,
    discountType: 'amount' | 'percent'
}


type TPromotionProductQuantity = {
    productId?: number,
    productVariantId?: number,
    productCatalogue?: number,
    minQuantity?: number,
    maxDiscount?: number,
    discountValue?: number,
    discountType?: 'amount' | 'percent'
}

type promotionProductCombo = {
    productId?: number,
    productVariantId?: number
}

export interface IPromotionDataChange {
    key: 'promotionOrderAmountRange' | 'promotionProductQuantity' | 'promotionProductCombo',
    data: TpromotionOrderAmountRange[] | TPromotionProductQuantity[] | promotionProductCombo[]
}


export interface IPromotionProductDataChange {
    isDefault: number,
    defaultDiscountValue: number,
    defaultDiscountType: 'amount' | 'percent',
    defaultMinQuantity: number,
    promotionCondition: IPromotionDataChange
}

// xử lý dữ liệu khuyến mãi khi chỉnh sửa
export interface promotionConditionOrderRangeReponse {
    minValue: number,
    maxValue: number,
    discountValue: number,
    discountType: 'amount' | 'percent'
}
// xử lý dữ liệu khuyến mãi khi chỉnh sửa
export interface promotionConditionComboReponse {
    productId?: number,
    productVariantId?: number,
    item: selectedProductDiglog
}

export interface promotionCondtionDiscountReponse {
    productId?: number,
    productVariantId?: number,
    productCatalogueId?: number,
    minQuantity?: number,
    maxDiscount?: number,
    discountValue?: number,
    discountType?: 'amount' | 'percent'
    item: selectedProductDiglog
}

interface IPromotionComponentProps {
    onDataChange: (data: IPromotionDataChange | IPromotionProductDataChange) => void
    isUpdateModel: boolean
}


const OrderAmountRangeComponent: React.FC<IPromotionComponentProps> = React.memo(({ onDataChange, isUpdateModel }) => {

    // Nếu bạn muốn lấy giá trị từ form, hãy dùng watch hoặc getValues từ useFormContext
    const { watch } = useFormContext();
    // Ví dụ: const comboPrice = watch('comboPrice');
    const isInitRef = useRef<boolean>(false);

    const [priceRanges, setPriceRanges] = useState<IpriceRange[]>([
        { id: '1', fromPrice: '0', toPrice: '0', discount: '0', type: 'amount' }
    ])

    const addPriceRange = () => {
        setPriceRanges([...priceRanges, {
            id: Date.now().toString(),
            fromPrice: '0',
            toPrice: '0',
            discount: '0',
            type: 'amount'
        }])
    }

    const handleDelete = (id: string) => {
        if (id === undefined) return;
        setPriceRanges(prev => prev.filter(item => item.id !== id))
    }

    // cập nhật giá trị trong khoảng giá
    // value: giá trị mới
    const updateRange = (value: number | string | undefined, id: string, field: keyof IpriceRange) => {
        setPriceRanges(prev => (prev.map(item => (item.id === id ? { ...item, [field]: value } : item))))
    }

    // khi có sự thay đổi trong khoảng giá, gửi dữ liệu lên cha
    // priceRanges: danh sách khoảng giá
    // onDataChange: hàm callback để gửi dữ liệu lên cha
    useEffect(() => {
        const promotionData: IPromotionDataChange = {
            key: 'promotionOrderAmountRange',
            data: priceRanges.map((range) => ({
                minValue: parseInt(range.fromPrice),
                maxValue: parseInt(range.toPrice),
                discountValue: parseInt(range.discount),
                discountType: range.type
            }))
        }
        onDataChange(promotionData)
    }, [priceRanges, onDataChange])

    // reload lại dữ liệu khi chỉnh sửa
    const promotionConditons: promotionConditionOrderRangeReponse[] = watch('promotionCondition');
    useEffect(() => {
        if (isUpdateModel && Array.isArray(promotionConditons) && !isInitRef.current) {
            const conditionData: IpriceRange[] = promotionConditons.map((item, index) => ({
                id: `${Date.now()}-${index}`,
                fromPrice: item.minValue.toString(),
                toPrice: item.maxValue.toString(),
                discount: item.discountValue.toString(),
                type: item.discountType
            }))
            setPriceRanges(conditionData)
            isInitRef.current = true
        }
    }, [promotionConditons, isUpdateModel])


    return (
        <>
            <div className="space-y-4">
                <div className="text-blue-600 font-medium text-[13px]">Thiếp lập mức chiếc khấu</div>
                <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-600">
                    <div className="col-span-3">Giá trị từ</div>
                    <div className="col-span-3">Giá trị đến</div>
                    <div className="col-span-4 text-center">Chiếc khấu</div>
                    <div className="col-span-1 text-center">Đơn vị</div>
                    <div className="col-span-1 text-center">Thao tác</div>
                </div>

                {priceRanges.map((item) => (
                    <div className="grid items-center grid-cols-12 gap-4" key={item.id}>

                        <div className="col-span-3">
                            <NumericFormat
                                value={item.fromPrice}
                                onValueChange={(values) => updateRange(values.floatValue, item.id, 'fromPrice')}
                                thousandSeparator="."
                                decimalSeparator=","
                                allowNegative={false}
                                className="h-[36px] border border-[#5e5e5e] rounded-[8px] px-[10px] text-[14px] font-medium w-full"
                                placeholder="Nhập giá trị từ"
                            />
                        </div>
                        <div className="col-span-3">
                            <NumericFormat
                                value={item.toPrice}
                                onValueChange={(values) => updateRange(values.floatValue, item.id, 'toPrice')}
                                thousandSeparator="."
                                decimalSeparator=","
                                allowNegative={false}
                                className="h-[36px] border border-[#5e5e5e] rounded-[8px] px-[10px] text-[14px] font-medium w-full"
                                placeholder="Nhập giá trị đến"
                            />
                        </div>
                        <div className="col-span-4">
                            <NumericFormat
                                value={item.discount}
                                onValueChange={(values) => updateRange(values.floatValue, item.id, 'discount')}
                                thousandSeparator="."
                                decimalSeparator=","
                                allowNegative={false}
                                className="h-[36px] border border-[#5e5e5e] rounded-[8px] px-[10px] text-[14px] font-medium w-full"
                                placeholder="Nhập chiếc khấu"
                            />
                        </div>
                        <div className="col-span-1">
                            <Select
                                value={item.type}
                                onValueChange={(values) => updateRange(values, item.id, 'type')}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="amount">đ</SelectItem>
                                    <SelectItem value="percent">%</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="col-span-1 text-center">
                            <button type="button" className="cursor-pointer" onClick={() => handleDelete(item.id)} >
                                <Trash2 />
                            </button>
                        </div>
                    </div>
                ))}
                <Button onClick={addPriceRange} type="button">
                    <Plus className="size-3" />
                    Thêm điều kiện
                </Button>
            </div>
        </>
    )
})

const PromotionProductCombo: React.FC<IPromotionComponentProps> = React.memo(({ onDataChange, isUpdateModel }) => {

    const [selectedProductList, setSelectProductlist] = useState<selectedProductDiglog[]>([])
    const [promotionConditionData, setPromotionConditionData] = useState<SelectedItem[]>([])

    const { control, watch } = useFormContext()

    const handleProductSelected = useCallback((selectedProduct: selectedProductDiglog[]) => {
        setSelectProductlist(selectedProduct)

        const conditionPromotion: SelectedItem[] = selectedProduct.map(item => {
            if (item.type === 'product') {
                return { productId: item.id }
            } else if (item.type === 'variant') {
                return { productVariantId: item.id }
            }
            return {}
        }).filter(item => Object.keys(item).length > 0)
        setPromotionConditionData(conditionPromotion)
    }, [])

    useEffect(() => {
        const promotionData: IPromotionDataChange = {
            key: 'promotionProductCombo',
            data: promotionConditionData
        }
        onDataChange(promotionData)
    }, [promotionConditionData, onDataChange])

    // xử lý chỉnh sửa hoặc khi reload lại thì có dữ liệu
    const promotionConditions: promotionConditionComboReponse[] = watch('promotionCondition')

    useEffect(() => {
        if (isUpdateModel && Array.isArray(promotionConditions)) {
            const conditionData: SelectedItem[] = promotionConditions.map((item) => ({
                productId: item.productId,
                productVariantId: item.productVariantId
            }))
            const productList: selectedProductDiglog[] = promotionConditions.filter(condition => condition.item).map((condition) => ({
                ...condition.item
            })) as selectedProductDiglog[]
            setPromotionConditionData(conditionData)
            setSelectProductlist(productList)
        }
    }, [isUpdateModel, promotionConditions])

    return (
        <>
            <div className="space-y-4">
                {selectedProductList && (
                    <div className="bg-blue-50 p-[10px] rounded-[5px]">
                        <div className="text-[12px] font-medium text-blue-800 mb-[10px]">
                            Đã chọn {selectedProductList.length} sản phẩm
                        </div>
                        <div className="space-y-2">
                            {selectedProductList.map((product, index) => (
                                <div key={index} className="flex items-center justify-between text-[12px]">
                                    <div className="items-center flex-1">
                                        <div className="font-medium">
                                            - {product.name} - Giá:<span className="text-red-500"> {formatPrice(String(product.price))}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-600">
                    <div className="col-span-9">Chọn sản phẩm trong combo</div>
                    <div className="col-span-3">Giá của combo</div>
                </div>
                <div className="grid items-center grid-cols-12 gap-4">
                    <div className="col-span-9">
                        <ProductSelectorDialog onProductSelected={handleProductSelected}>
                            <Button className="py-[15px] bg-[#ed5565] cursor-pointer rounded-[5px]">
                                Click để chọn sản phẩm trong combo
                            </Button>
                        </ProductSelectorDialog>
                    </div>
                    <div className="col-span-3">
                        <FormField
                            control={control}
                            name="comboPrice"
                            render={({ field }) => (
                                <FormItem className="mb-[20px]">
                                    <FormControl>
                                        <NumericFormat
                                            value={field.value}
                                            onValueChange={(values) => field.onChange(values.floatValue || 0)}
                                            thousandSeparator="."
                                            decimalSeparator=","
                                            allowNegative={false}
                                            className="h-[36px] border border-[#5e5e5e] rounded-[8px] px-[10px] text-[14px] font-medium w-full"
                                            placeholder="0"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>
            </div>
        </>
    )
})


const PromotionProductDiscount: React.FC<IPromotionComponentProps> = memo(({ onDataChange, isUpdateModel }) => {

    const isInitUpdate = useRef<boolean>(false);
    const { watch } = useFormContext()
    const [selectedProductList, setSelectProductlist] = useState<selectedProductDiglog[]>([])
    const [promotionConditionData, setPromotionConditionData] = useState<SelectedItem[]>([])

    const [defaultDiscount, setDefaultDiscount] = useState<boolean>(true)
    // trường hợp khuyến mãi default (mặc định)
    const [commonDiscountValue, setCommonDiscountValue] = useState<number>(0)
    const [commonDiscountType, setCommonDiscountType] = useState<'percent' | 'amount'>('amount')
    const [commonDiscountMinQuantity, setCommonDiscountMinQuantity] = useState<number>(0)

    // trường hợp khuyến mãi theo từng sản phẩm phiên bản
    const [individualDiscount, setIndividualDiscount] = useState<IndividualDiscount[]>([])

    // hàm xử lý khi có sản phẩm được chọn từ dialog
    // selectedProduct: danh sách sản phẩm được chọn từ dialog
    const handleProductSelected = useCallback((selectedProduct: selectedProductDiglog[]) => {
        setSelectProductlist(selectedProduct)

        const conditionData: SelectedItem[] = selectedProduct.map(item => {
            if (item.type === 'product') {
                return { productId: item.id }
            } else if (item.type === 'variant') {
                return { productVariantId: item.id }
            }
            return {}
        }).filter(item => Object.keys(item).length > 0)
        setPromotionConditionData(conditionData)
        if (!defaultDiscount) {
            const newIndividualDiscount: IndividualDiscount[] = conditionData.map((item) => ({
                ...item,
                minQuantity: 1,
                maxDiscount: 0,
                discountValue: 0,
                discountType: 'amount' as const
            }))
            setIndividualDiscount(newIndividualDiscount)
        }
    }, [defaultDiscount])

    // hàm xử lý nếu checkbox thì giảm giá mặc định không checkbox thì giam giá theo từng sản phẩm
    const handleChecked = (checked: boolean) => {
        setDefaultDiscount(checked)
        if (!checked && selectedProductList.length > 0) {
            const newIndividualDiscount: IndividualDiscount[] = promotionConditionData.map((item) => ({
                ...item,
                minQuantity: 1,
                maxDiscount: 0,
                discountValue: 0,
                discountType: 'amount' as const
            }))
            setIndividualDiscount(newIndividualDiscount)
        }
    }

    // cập nhật thông tin giảm giá cho từng sản phẩm
    // index: vị trí của sản phẩm trong danh sách selectedProductList
    const updateIndividualDiscount = (index: number, field: keyof IndividualDiscount, value: unknown) => {
        setIndividualDiscount(prev => {
            const newDiscount = [...prev]
            newDiscount[index] = { ...newDiscount[index], [field]: value }
            return newDiscount
        })
    }

    // xử lý 2 trường hợp khi thêm dữ liệu vào onDataChange để set giá trị
    // nếu không checked (defaultDiscoint thì là 1  giảm giá mặc định còn 0 là giảm giá theo phiên bản)
    useEffect(() => {
        const promotionData: IPromotionProductDataChange = {
            isDefault: defaultDiscount ? 1 : 0,
            defaultDiscountValue: commonDiscountValue,
            defaultDiscountType: commonDiscountType,
            defaultMinQuantity: commonDiscountMinQuantity,
            promotionCondition: {
                key: 'promotionProductQuantity',
                data: defaultDiscount ? promotionConditionData : individualDiscount
            }
        }
        onDataChange(promotionData)
    }, [promotionConditionData, individualDiscount, defaultDiscount, onDataChange, commonDiscountValue, commonDiscountType, commonDiscountMinQuantity])



    // xử lý chỉnh sửa reload dữ liệu lại
    const promotionConditions: promotionCondtionDiscountReponse[] = watch('promotionCondition')
    const isDefaultReponse: number = watch('isDefault')
    const defaultDiscountValue = watch('defaultDiscountValue')
    const defaultDiscountType = watch('defaultDiscountType')
    const defaultMinQuantity = watch('defaultMinQuantity')

    // console.log(promotionConditions);
    // console.log(isDefaultReponse);
    // console.log(defaultDiscountValue);
    // console.log('defaultDiscountType' + defaultDiscountType);
    // console.log('defaultMinQuantity' + defaultMinQuantity);

    // chỉnh sửa reload lại dữ liệu của khuyến mãi theo sản phẩm và khuyến mãi mặc định
    useEffect(() => {
        if (isUpdateModel && Array.isArray(promotionConditions) && !isInitUpdate.current) {
            const productList: selectedProductDiglog[] = promotionConditions.filter(condition => condition.item).map(condition => ({
                ...condition.item
            })) as selectedProductDiglog[]
            setSelectProductlist(productList);
            setDefaultDiscount(isDefaultReponse === 1 ? true : false)

            if (isDefaultReponse === 1) {
                setCommonDiscountValue(defaultDiscountValue)
                setCommonDiscountType(defaultDiscountType)
                setCommonDiscountMinQuantity(defaultMinQuantity)
            } else {
                const IndividualData: IndividualDiscount[] = promotionConditions.map((condition) => ({
                    productId: condition.productId,
                    productVariantId: condition.productVariantId,
                    minQuantity: condition.minQuantity || 1,
                    maxDiscount: condition.maxDiscount || 0,
                    discountValue: condition.discountValue || 0,
                    discountType: condition.discountType || 'amount'
                }))
                // console.log(IndividualData)
                setIndividualDiscount(IndividualData)
            }
            const conditionData: SelectedItem[] = promotionConditions.map((condition) => ({
                productId: condition.productId,
                productVariantId: condition.productVariantId
            })).filter(item => item.productId || item.productVariantId)
            setPromotionConditionData(conditionData)

            isInitUpdate.current = true
        }

    }, [isUpdateModel, promotionConditions, defaultMinQuantity, defaultDiscountValue, defaultDiscountType])

    useEffect(() => {
        if (!isUpdateModel) {
            isInitUpdate.current = false
        }
    }, [isUpdateModel])



    return (
        <>
            <div className="space-y-4">
                <div className="flex items-center">
                    <Checkbox onCheckedChange={handleChecked} checked={defaultDiscount} className="cursor-pointer" id="defaultDiscount" />
                    <Label className="ml-[10px] cursor-pointer font-normal" htmlFor="defaultDiscount">
                        Chọn giảm giá
                    </Label>
                </div>
                {/* khuyến mãi chung */}
                {defaultDiscount && selectedProductList.length > 0 && (
                    <div className="bg-blue-50 rounded-[5px] p-[10px]">
                        <div className="text-blue-600 font-medium text-[12px] mb-[20px]">
                            Thiếp lập thông số khuyến mãi mặc định
                        </div>
                        {selectedProductList && (
                            <div className="bg-blue-50 p-[10px] rounded-[5px]">
                                <div className="text-[12px] font-medium text-blue-800 mb-[10px]">
                                    Đã chọn {selectedProductList.length} sản phẩm
                                </div>
                                <div className="space-y-2">
                                    {selectedProductList.map((product, index) => (
                                        <div key={index} className="flex items-center justify-between text-[12px]">
                                            <div className="items-center flex-1">
                                                <div className="font-medium">
                                                    - {product.name} - Giá:<span className="text-red-500"> {formatPrice(String(product.price))}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        <div className="grid grid-cols-12 gap-4 text-[12px] font-medium text-gray-600 mb-[10px]">
                            <div className="col-span-3">Giá trị khuyến mãi</div>
                            <div className="col-span-1">Loại</div>
                            <div className="col-span-2">Số lượng</div>
                        </div>
                        <div className="grid grid-cols-12 gap-4 text-[12px] font-medium text-gray-500 mb-[10px]">
                            <div className="col-span-3">
                                <NumericFormat
                                    value={commonDiscountValue}
                                    onValueChange={(e) => setCommonDiscountValue(e.floatValue || 0)}
                                    thousandSeparator="."
                                    decimalSeparator=","
                                    allowNegative={false}
                                    className="h-[36px] border border-[#5e5e5e] rounded-[8px] px-[10px] text-[14px] font-medium w-full"
                                    placeholder="0"
                                />
                            </div>
                            <div className="col-span-1">
                                <Select onValueChange={(value: 'amount' | 'percent') => setCommonDiscountType(value)} value={commonDiscountType} >
                                    <SelectTrigger className="h-[36px] w-full border border-[#5e5e5e] rounded-[8px] px-[10px] text-[14px] font-medium">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="amount">đ</SelectItem>
                                        <SelectItem value="percent">%</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="col-span-2">
                                <NumericFormat
                                    value={commonDiscountMinQuantity}
                                    onValueChange={(e) => setCommonDiscountMinQuantity(e.floatValue || 0)}
                                    thousandSeparator="."
                                    decimalSeparator=","
                                    allowNegative={false}
                                    className="h-[36px] border border-[#5e5e5e] rounded-[8px] px-[10px] text-[14px] font-medium w-full"
                                    placeholder="0"
                                />
                            </div>

                        </div>
                    </div>
                )}

                {!defaultDiscount && selectedProductList && (
                    <div className="bg-blue-50 rounded-[5px] p-[10px]">
                        <div className="text-blue-600 font-medium text-[12px] mb-[20px]">
                            Thiếp lập thông số khuyến mãi theo từng phiên bản
                        </div>
                        <div className="grid grid-cols-12 gap-4 text-[12px] font-medium text-gray-600 mb-[10px]">
                            <div className="col-span-3">Tên sản phẩm</div>
                            <div className="col-span-2">Sl tối thiểu</div>
                            <div className="col-span-2">Giá trị khuyến mãi</div>
                            <div className="col-span-1">Loại</div>
                            <div className="col-span-2">Giá trị tối đa</div>
                        </div>
                        {individualDiscount.map((discount, index) => {
                            const product = selectedProductList[index]
                            return (
                                <div key={index} className="grid grid-cols-12 gap-4 text-[12px] font-medium text-gray-500 mb-[10px]">
                                    <div className="col-span-3">{product.name}</div>
                                    <div className="col-span-2">
                                        <NumericFormat
                                            value={discount.minQuantity}
                                            onValueChange={(e) => updateIndividualDiscount(index, 'minQuantity', e.floatValue || 0)}
                                            thousandSeparator="."
                                            decimalSeparator=","
                                            allowNegative={false}
                                            className="h-[36px] border border-[#5e5e5e] rounded-[8px] px-[10px] text-[14px] font-medium w-full"
                                            placeholder="0"
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <NumericFormat
                                            value={discount.discountValue}
                                            onValueChange={(e) => updateIndividualDiscount(index, 'discountValue', e.floatValue || 0)}
                                            thousandSeparator="."
                                            decimalSeparator=","
                                            allowNegative={false}
                                            className="h-[36px] border border-[#5e5e5e] rounded-[8px] px-[10px] text-[14px] font-medium w-full"
                                            placeholder="0"
                                        />
                                    </div>
                                    <div className="col-span-1">
                                        <Select onValueChange={(value: 'amount' | 'percent') => updateIndividualDiscount(index, 'discountType', value)} value={discount.discountType} >
                                            <SelectTrigger className="h-[36px] w-full border border-[#5e5e5e] rounded-[8px] px-[10px] text-[14px] font-medium">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="amount">đ</SelectItem>
                                                <SelectItem value="percent">%</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="col-span-2">
                                        <NumericFormat
                                            value={discount.maxDiscount}
                                            onValueChange={(e) => updateIndividualDiscount(index, 'maxDiscount', e.floatValue || 0)}
                                            thousandSeparator="."
                                            decimalSeparator=","
                                            allowNegative={false}
                                            className="h-[36px] border border-[#5e5e5e] rounded-[8px] px-[10px] text-[14px] font-medium w-full"
                                            placeholder="0"
                                        />
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}


                <div className="grid items-center grid-cols-12 gap-4">
                    <div className="col-span-9">
                        <ProductSelectorDialog onProductSelected={handleProductSelected}>
                            <Button className="py-[15px] bg-[#ed5565] cursor-pointer rounded-[5px]">
                                Click để chọn các sản phẩm khuyến mãi
                            </Button>
                        </ProductSelectorDialog>
                    </div>
                </div>
            </div>
        </>
    )
})



const PromotionTypeRender = ({ PromotionCatalogueId, isUpdateModel }: IPromotionTypeRender) => {

    const { setValue } = useFormContext();

    const handlePromotionChange = useCallback((data: IPromotionDataChange | IPromotionProductDataChange) => {
        if ('isDefault' in data) {
            setValue('isDefault', data.isDefault, { shouldValidate: true }),
                setValue('defaultDiscountValue', data.defaultDiscountValue, { shouldValidate: true }),
                setValue('defaultDiscountType', data.defaultDiscountType, { shouldValidate: true }),
                setValue('defaultMinQuantity', data.defaultMinQuantity, { shouldValidate: true }),
                setValue('promotionCondition', data.promotionCondition, { shouldValidate: true })
        } else {
            setValue('promotionCondition', data, { shouldValidate: true })
        }
    }, [setValue])


    const renderPromotion = (PromotionCatalogueId: number | undefined) => {
        switch (PromotionCatalogueId) {
            case 4:
                return <OrderAmountRangeComponent isUpdateModel={isUpdateModel} onDataChange={handlePromotionChange} />
            case 3:
                return <PromotionProductCombo isUpdateModel={isUpdateModel} onDataChange={handlePromotionChange} />
            case 2:
                return <PromotionProductDiscount isUpdateModel={isUpdateModel} onDataChange={handlePromotionChange} />
            default:
                return <>
                    <div className="text-center text-red-500">
                        * Vui lòng chọn chương trình khuyến mãi *
                    </div>
                </>
        }
    }

    return (
        <div className="mt-[20px]">
            {renderPromotion(PromotionCatalogueId)}
        </div>
    )
}


export default PromotionTypeRender