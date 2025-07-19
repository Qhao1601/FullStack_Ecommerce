import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { IProductVariantResponse } from "@/interfaces/products/products.interface"
import React, { useCallback, useEffect, useState } from "react"
import { getStatus, buildUrlWithQueryString } from "@/utils/helper"
import * as z from "zod"
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
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { createPortal } from "react-dom"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "./ui/button"
import { NumericFormat } from "react-number-format"
import { ISelectOptionItem } from "@/config/constans"
import { IAttributes } from "@/interfaces/attributes/attributeCatalogues.interface"
import { baseService } from "@/services/base.service"
import { isApiSuccessResponse } from "@/interfaces/api.response"
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select"
import { useQueryClient } from "@tanstack/react-query"
import useApi from "@/hooks/useApi"
import { AxiosError } from "axios"
import { toast } from "sonner"
import { useSelector } from "react-redux"
import { RootState } from "@/stores"


import DeleteConfirmDialog from "./ui/delete-confirm-dialog"


const variantSchema = z.object({
    sku: z.string().optional(),
    price: z.number().min(0, { message: "Bạn phải nhập giá phiên bản" }),
    stock: z.number().min(0, { message: "Bạn phải nhập số lượng tồn kho" }),
    attributes: z.any().optional()
})

type variantFormValues = z.infer<typeof variantSchema>

const VariantDialog = ({
    isopen,
    onClose,
    loading,
    attributeGroups,
    variant,
    onSubmit }: {
        isopen: boolean,
        onClose: () => void,
        loading: boolean,
        attributeGroups: IAttributeGroup[]
        variant: IProductVariantResponse | null,
        onSubmit: (data: variantFormValues, id?: number) => Promise<void>
    }) => {

    const [isSubmiting, setIsSubmiting] = useState<boolean>(false)

    const form = useForm<variantFormValues>({
        resolver: zodResolver(variantSchema),
        defaultValues: {
            sku: variant?.sku || '',
            price: variant?.price || 0,
            stock: Number(variant?.stock) || 0
        },
        shouldFocusError: false,
        shouldUnregister: true
    })

    const handleClose = () => {
        form.reset()
        onClose()
    }

    // thêm phiên bản 
    const handleFormSubmit = async (values: variantFormValues) => {
        const attrs = Object.values(values.attributes ?? {})
            .filter((value): value is string => typeof value === 'string' && value.trim() !== '');
        const sortId = [...attrs].sort((a, b) => Number(a) - Number(b))
        const payload = {
            ...values,
            barcode: '',
            code: sortId.join('_'),
            variant_attributes: attrs
        }
        console.log(payload)
        setIsSubmiting(true)
        try {
            await onSubmit(payload, variant?.id)
            handleClose()
        } catch (error) {
            console.log('Thêm phiên bản thất bại', error)
        } finally {
            setIsSubmiting(false)
        }
    }

    // xử lý lấy thông tin khi chỉnh sửa phiên bản để cập nhật lại phiên bản
    useEffect(() => {
        if (isopen) {
            const formValues: variantFormValues = {
                sku: variant?.sku || '',
                price: variant?.price || 0,
                stock: Number(variant?.stock) || 0,
                attributes: {}
            }
            if (variant?.attributes && variant.attributes.length > 0 && attributeGroups.length) {
                variant.attributes.forEach((attributeId) => {
                    attributeGroups.forEach(group => {
                        const foundAttribute = group.attributes.find(attr => attr.id === attributeId)
                        if (foundAttribute) {
                            formValues.attributes[`attr_${group.id}`] = attributeId.toString()
                        }
                    })
                })
            }
            setTimeout(() => {
                form.reset(formValues)
            }, 1)
        }
    }, [variant, isopen, form, attributeGroups])



    return createPortal(
        <Dialog open={isopen} onOpenChange={handleClose}>
            <DialogContent className="!max-w-[800px] mx-h-[80vh] overflow-y-auto" aria-describedby="variant-dialog-description">
                <DialogHeader>
                    <DialogTitle>
                        {variant ? 'Cập nhật phiên bản' : 'Thêm phiên bản mới'}
                    </DialogTitle>
                    <DialogDescription>
                        {variant ? 'Cập nhật đầy đủ các thông tin của phiên bản ' : 'Nhập thông tin dưới đây cho phiên bản'}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    {/* <form onSubmit={form.handleSubmit((values, event) => {
                        event?.preventDefault?.()
                        event?.stopPropagation?.()
                        handleFormSubmit(values)
                    })} className="space-y-4"> */}
                    <form className="space-y-4">
                        <div className="grid grid-cols-3 gap-4">
                            <FormField
                                control={form.control}
                                name="sku"
                                render={({ field }) => (
                                    <FormItem className="mb-[20px]">
                                        <FormLabel>Mã phiên bản</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="price"
                                render={({ field }) => (
                                    <FormItem className="mb-[20px]">
                                        <FormLabel>Giá phiên bản</FormLabel>
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
                                control={form.control}
                                name="stock"
                                render={({ field }) => (
                                    <FormItem className="mb-[20px]">
                                        <FormLabel>Số lượng tồn</FormLabel>
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
                        </div>
                        {loading ? (
                            <div className="text-center text-navy">Đang tải thuộc tính</div>
                        ) : (
                            <div className="grid grid-cols-3 gap-4">
                                {attributeGroups.map((group) => (
                                    <FormField
                                        key={group.id}
                                        control={form.control}
                                        name={`attributes.attr_${group.id}`}
                                        render={({ field }) => {
                                            return (
                                                <FormItem className="w-full">
                                                    <FormLabel>{group.name}</FormLabel>
                                                    <FormControl>
                                                        <Select
                                                            onValueChange={field.onChange}
                                                            value={field.value?.toString()} >
                                                            <SelectTrigger className="w-full cursor-pointer">
                                                                <SelectValue placeholder={`chọn ${group.name}`} />
                                                            </SelectTrigger>
                                                            <SelectContent className="w-full">
                                                                {group.attributes && group.attributes.map((item) => (
                                                                    <SelectItem key={item.id} value={item.id.toString()}>{item.name}</SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )
                                        }}
                                    />
                                ))}
                            </div>
                        )}
                        <DialogFooter>
                            <Button type="button"
                                variant="outline"
                                onClick={handleClose}
                                disabled={isSubmiting}
                            >
                                Hủy tác vụ
                            </Button>
                            {/* <Button type="submit" disabled={isSubmiting}>
                                {isSubmiting ? 'Đang đợi tạo phiên bản...' : 'Lưu thông tin'}
                            </Button> */}
                            <Button
                                type="button"
                                onClick={form.handleSubmit(handleFormSubmit)}>
                                Lưu thông tin
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
        , document.body)
}



type ProductVariantItemProps = {
    item: IProductVariantResponse,
    index: number,
    status: { text: string, className: string },
    getVariantName: (variant: IProductVariantResponse) => string,
    onRemove: (variantId: number) => void,
    onUpdate: (variant: IProductVariantResponse) => void
}

const ProductVariantItem: React.FC<ProductVariantItemProps> = React.memo(
    ({ item, index, status, getVariantName, onRemove, onUpdate }) => (
        <>
            <div key={item.id || index} className="flex items-start gap-4 p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                {/* Hình ảnh */}
                <div className="w-[50px] h-[50px] bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                    <img className="object-cover w-full h-full" src="https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.vecteezy.com%2Ffree-vector%2Fno-image-available&psig=AOvVaw31yqJmqOwZlOI4jXtEtX5F&ust=1749141788696000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCIiW8MOb2I0DFQAAAAAdAAAAABAT" alt="Ảnh biến thể" />
                </div>
                {/* Nội dung */}
                <div className="flex-1 min-w-0">
                    {/* Tên + Nút */}
                    <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
                        <h4 className="font-medium text-gray-900 text-sm leading-snug line-clamp-2 max-w-[250px]">
                            {getVariantName(item)}
                        </h4>
                        <div className="flex items-center flex-shrink-0 gap-2">
                            <button type="button" className="text-xs text-blue-500 hover:text-blue-700" onClick={() => onUpdate(item)}>Chỉnh sửa</button>
                            <DeleteConfirmDialog item={item} onDelete={onRemove} >
                                <button type="button" className="text-xs text-red-500 hover:text-red-700">Xóa</button>
                            </DeleteConfirmDialog>
                        </div>
                    </div>

                    {/* SKU + Giá + Trạng thái */}
                    <div className="flex flex-wrap text-xs text-gray-700 gap-x-6 gap-y-1">
                        <div className="font-semibold text-pink-800 whitespace-nowrap">SKU: {item.sku}</div>
                        <div className="font-semibold text-blue-800 whitespace-nowrap">Giá: {(item.price)}</div>
                        <div className={`whitespace-nowrap font-semibold ${status.className}`}>
                            Trạng thái: {status.text}
                        </div>
                    </div>
                </div>
            </div>


        </>
    ),
    (prevProps, nextProps) => {
        const doRender = (
            prevProps.item.id === nextProps.item.id
        )
        return doRender
    }
)


export interface IProductVariantUpdate {
    productVariants: IProductVariantResponse[],
    productName: string,
    productId: number,
    attributeCatalogueUser: ISelectOptionItem[] | undefined,
    // onVariantsChanged?: () => void
}

interface IAttributeGroup {
    id: number,
    name: string,
    attributes: IAttributes[]
}

const ProductVariantUpdate = ({ productVariants, productName, productId, attributeCatalogueUser }: IProductVariantUpdate) => {
    const api = useApi()
    const queryClient = useQueryClient()
    const auth = useSelector((state: RootState) => state.auth)


    const [isdialogOpen, setIsDialogOpen] = useState<boolean>(false)

    const [variant, setVariant] = useState<IProductVariantResponse | null>(null)

    const [isLoading, setIsloading] = useState<boolean>(false)

    const [attributeGroup, setAttributeGroup] = useState<IAttributeGroup[]>([])


    const handleAddNewVariant = (variant?: IProductVariantResponse) => {
        setVariant(variant ?? null)
        setIsDialogOpen(true)
    }

    useEffect(() => {
        console.log(attributeCatalogueUser);
    }, [attributeCatalogueUser])


    const variantCreateAction = api.useCreate<IProductVariantResponse, variantFormValues>('/v1/product_variants')
    const variantUpdateAction = api.usePatchUpdate<IProductVariantResponse, variantFormValues>('v1/product_variants')

    const handleSubmitVariant = async (data: variantFormValues, id?: number) => {
        const payload = {
            ...data,
            productId,
            userId: auth.user?.id,
            publish: 2
        }
        console.log(payload);
        if (id) {
            variantUpdateAction.mutate({ payload, id }, {
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ['/v1/products', productId], exact: true })
                    queryClient.refetchQueries({ queryKey: ['/v1/products', productId], exact: true })

                    toast.success('Cập nhật bản ghi thành công')
                    // onVariantsChanged?.()
                },
                onError: (error) => {
                    if (error instanceof AxiosError) {
                        toast.error(error.response?.data.message)
                    }
                }
            })
        } else {
            variantCreateAction.mutate(payload, {
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ['/v1/products', productId], exact: true })
                    queryClient.refetchQueries({ queryKey: ['/v1/products', productId], exact: true })
                    toast.success('Thêm mới phiên bản thành công')
                },
                onError: (error) => {
                    if (error instanceof AxiosError) {
                        toast.error(error.response?.data.message)
                    }
                }
            })
        }
    }

    const variantDeleteAction = api.useDelete('/v1/product_variants')
    const handleDelete = useCallback((variantId: number) => {
        variantDeleteAction.mutate(variantId, {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['/v1/products', productId], exact: true })
                queryClient.invalidateQueries({ queryKey: ['/v1/product_variants', variantId], exact: true })
                queryClient.refetchQueries({ queryKey: ['/v1/products', productId], exact: true })
                queryClient.refetchQueries({ queryKey: ['/v1/product_variants', variantId], exact: true })
                toast.success('Xóa bản phiên bản thành công')
            }
        })
    }, [variantDeleteAction, productId, queryClient])



    const getVariantName = useCallback((variant: IProductVariantResponse) => {
        if (variant.attributeNames && variant.attributeNames.length) {
            return `${productName} - ${variant.attributeNames.join('-')}`
        }
        return productName
    }, [productName])


    useEffect(() => {
        const fetchAttributeGroup = async () => {
            if (!attributeCatalogueUser || attributeCatalogueUser.length === 0) return
            setIsloading(true)
            try {
                const promises = attributeCatalogueUser.map(catalogue => {
                    const url = buildUrlWithQueryString('v1/attributes', {
                        type: 'all',
                        attributeCatalogueId: catalogue.value
                    })
                    return baseService.paginate<IAttributes>(url)
                })
                const response = await Promise.all(promises)
                // console.log(response);
                const groups = response.map((response, index) => ({
                    id: parseInt(attributeCatalogueUser[index].value),
                    name: attributeCatalogueUser[index].label,
                    attributes: isApiSuccessResponse(response) ? response.data as unknown as IAttributes[] : []
                }))
                setAttributeGroup(groups)
            } catch (errors) {
                console.log('lổi khi lấy danh mục thuốc tính ', errors)
            } finally {
                setIsloading(false)
            }
        }
        fetchAttributeGroup()
    }, [attributeCatalogueUser])




    return (
        <>
            <Card className="rounded-[5px] pt-[10px] mb-[20px] pb-[15px]">
                <CardHeader className="border-b pt-[10px] custom-padding">
                    <CardTitle className="font-normal ">
                        <div className="flex items-center justify-between">
                            <span> Danh sách phiên bản ({productVariants.length || 0})</span>
                            <span className="text-blue-600 text-[13px] cursor-pointer" onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                handleAddNewVariant()
                            }}>  + Thêm mới phiên bản</span>
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent className="px-[15px]">
                    {productVariants && productVariants.length > 0 ? (
                        productVariants.map((variant, index) => {
                            const status = getStatus(Number(variant.publish))
                            return (
                                <ProductVariantItem
                                    key={variant.id}
                                    item={variant}
                                    index={index}
                                    status={status}
                                    getVariantName={getVariantName}
                                    onRemove={handleDelete}
                                    onUpdate={handleAddNewVariant}
                                />
                            )
                        })
                    ) :
                        (
                            <div className="text-center text-red-500 text-[13px]">
                                <p>Sản phẩm hiện tại chưa có phiên bản nào</p>
                                <p>Nhấn vào nút "Thêm mới phiên bản" để bắt đầu</p>
                            </div>
                        )}
                </CardContent>
            </Card>
            <VariantDialog
                isopen={isdialogOpen}
                onClose={() => setIsDialogOpen(false)}
                loading={isLoading}
                attributeGroups={attributeGroup}
                variant={variant}
                onSubmit={handleSubmitVariant}

            />
        </>

    )
}


export default ProductVariantUpdate