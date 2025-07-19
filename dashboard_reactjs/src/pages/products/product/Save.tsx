import {
    Card,
    CardContent,

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
import { IProducts, IProductCreateRequest, IProductVariant } from "@/interfaces/products/products.interface"
import CKEditorComponent from "@/components/editor"
import { ISelectOptionItem, Publish } from "@/config/constans"
import Seo from "@/components/seo"
import Album from "@/components/album"
import useApi from "@/hooks/useApi"
import { useParams } from "react-router-dom"
import { useEffect, useMemo, useRef } from "react"
import { isApiSuccessResponse } from "@/interfaces/api.response"
import Parent from "@/components/parentId"
import Variant from "@/components/variant";
import { IAttributeCatalogues } from "@/interfaces/attributes/attributeCatalogues.interface";
import { IProductCatalogue } from "@/interfaces/products/product-catalogues.interface";
import ProductInfo from "@/components/product-info";
import Image from "@/components/image";
import CardCatalogue from "@/components/catalogues"
import CartAdvance from "@/components/advance";
import { FieldPath, FieldValues } from "react-hook-form";
import ProductVariantUpdate from "@/components/Product-variant-update";
import { IBrand } from "@/interfaces/brands/brand.interface"



interface IAdvanceItem<T extends FieldValues> {
    name: FieldPath<T>,
    data: ISelectOptionItem[],
    placeholder: string
}

const productVariantSchema = z.object({
    // uuid: z.string().min(1, { message: "uuid phải bắt buộc" }),
    userId: z.number().min(1, { message: "Bạn chưa chọn người tạo" }),
    code: z.string().optional(),
    stock: z.union([z.number(), z.string()]).refine(val => {
        const number = typeof (val) === 'string' ? parseInt(val) : val
        return !isNaN(number) && number >= 0
    }, { message: "Số lượng tồn kho không hợp lệ" }),
    price: z.number().min(0, { message: "Bạn phải nhập giá sản phẩm" }),
    sku: z.string().min(1, { message: "Bạn phải nhập mã sản phẩm" }),
    barcode: z.string().nullable().optional(),
    publish: z.number().optional(),
    attributes: z.array(z.number()).min(1, { message: "Bạn phải chọn thuộc tính" })
})


const createSchema = z.object({
    name: z.string().min(1, { message: 'Từ khóa của quyền bắt buộc' }),
    productCatalogueId: z.string().min(1, { message: 'Bạn phải chọn danh mục cha' }).refine(val => val !== '0', { message: "Chọn danh mục hợp lệ" }),
    image: z.union([z.instanceof(File), z.undefined(), z.null()]).optional(),
    publish: z.string().min(1, { message: "Bạn phải chọn trạng thái" }),
    description: z.string().nullable().optional(),
    content: z.string().optional(),
    metaTitle: z.string().optional(),
    metaKeyword: z.string().optional(),
    metaDescription: z.string().optional(),
    canonical: z.string().min(1, { message: "Bạn phải nhập đường dẫn" }),
    album: z.array(z.object({ path: z.string() })).optional(),
    removeImages: z.array(z.string()).optional(),
    productCatalogues: z.array(z.number()).min(1, { message: "Bạn phải chọn nhóm sản phẩm" }),
    code: z.string().optional(),
    price: z.number().min(0, { message: "Bạn chưa nhập giá sản phẩm" }),
    price_discount: z.number().optional(),
    made_in: z.string().optional(),
    brand_id: z.number().min(1, { message: "Bạn phải chọn thương hiệu" }),
    productVariants: z.array(productVariantSchema).optional()
})

const advance: IAdvanceItem<TFromValues>[] = [
    {
        name: 'publish',
        data: Publish,
        placeholder: 'Chọn trạng thái'
    }
]

const formConfig = (isUpdateMode: boolean) => ({
    schema: createSchema,
    defaultValues: {
        name: '',
        productCatalogueId: '0',
        image: undefined,
        publish: '2',
        description: '',
        content: '',
        metaTitle: '',
        metaKeyword: '',
        metaDescription: '',
        canonical: '',
        album: [],
        productCatalogues: [],
        code: Date.now().toString(),
        price: 0,
        price_discount: 0,
        made_in: '',
        brand_id: 0,
        productVariants: []
    },
    createTitle: 'Thêm mới bài viết',
    updateTitle: 'Chỉnh sửa bài viết',
    endpoint: '/v1/products',
    routerIndex: '/products',
    mapToRequest: (values: {
        name: string,
        productCatalogueId: string,
        publish: string,
        description?: string | null,
        content?: string,
        metaTitle?: string,
        metaKeyword?: string,
        metaDescription?: string,
        canonical: string,
        image?: File | undefined | null,
        album?: { path: string }[],
        removeImages?: string[],
        code?: string,
        price: number,
        price_discount?: number,
        made_in?: string,
        brand_id: number
        productCatalogues: number[]
        productVariants?: IProductVariant[]
    }, userId?: number): IProductCreateRequest => {
        const formData = new FormData()

        const updateProductCatalogue = [...values.productCatalogues, Number(values.productCatalogueId)]
        values = {
            ...values,
            productCatalogues: updateProductCatalogue
        }

        Object.entries(values).forEach(([key, value]) => {
            if (key === 'image' || key === 'album' || key === 'removeImages') {
                return
            }
            if (value !== undefined && value !== null) {
                formData.append(key, value?.toString())
            }
        })

        values.productCatalogues.map((catalogueId: number) => {
            formData.append(`productCatalogues[]`, catalogueId.toString().trim())
        })

        if (values.image instanceof File && values.image !== undefined) {
            formData.append('image', values.image)
        }
        if (values.album && Array.isArray(values.album) && values.album.length > 0) {
            values.album.forEach((file, index) => {
                formData.append(`album[${index}][path]`, file.path)
            })
        }

        if (values.productVariants && values.productVariants.length > 0 && !isUpdateMode) {
            values.productVariants.forEach((variant, index) => {
                Object.entries(variant).forEach((([key, value]) => {
                    formData.append(`productVariants[${index}][${key}]`, value?.toString() || '')
                }))
                if (variant.attributes && Array.isArray(variant.attributes)) {
                    variant.attributes.forEach((attrId, attrIndex) => {
                        formData.append(`productVariants[${index}][attributes][${attrIndex}]`, attrId.toString())
                    })
                }
            })
        }

        if (isUpdateMode) {
            formData.append('_method', 'PUT')
        }

        if (userId) formData.append('userId', userId.toString())
        return formData as unknown as IProductCreateRequest
    }
})

export type TFromValues = z.infer<typeof createSchema>

const ProductsSave = () => {

    const api = useApi()
    const { id } = useParams()
    const isUpdateMode = !!id
    const parentCategory = api.usePagiante<IProductCatalogue>('/v1/product_catalogues', { sort: 'lft, asc', type: 'all' })
    const attributeCategory = api.usePagiante<IAttributeCatalogues>('/v1/attribute_catalogues', { sort: 'lft,asc', type: 'all' })
    const brandCategory = api.usePagiante<IBrand[]>('/v1/brands', { sort: 'lft,asc', type: 'all' })


    const { onSubmit, form, record } = useCurd<IProducts, IProductCreateRequest, TFromValues>(formConfig(isUpdateMode))
    const formResetRef = useRef<boolean>(false)

    // const queryClient = useQueryClient();

    const { formState: { errors } } = form

    //data của nhóm sản phẩm
    const ParentCategoriOptions = useMemo(() => {
        if (parentCategory && isApiSuccessResponse(parentCategory.data)) {
            const CategoryData = parentCategory.data.data as unknown as IProductCatalogue[]
            return [
                { label: "Root", value: "0" },
                ...CategoryData.map((item) => ({
                    value: item.id.toString(),
                    label: `${"|---".repeat(item.level > 0 ? item.level - 1 : 0)}${item.name}`
                }))
            ]
        }
        return []
    }, [parentCategory])

    const BrandOptions = useMemo(() => {
        if (isApiSuccessResponse(brandCategory.data)) {
            const data = brandCategory.data.data as unknown as IBrand[]
            return data.map((item) => ({
                values: item.id.toString(),
                label: item.name
            }))
        }
        return []
    }, [brandCategory])

    // useEffect(() => {
    //     console.log(BrandOptions);
    // }, [BrandOptions])


    // lấy data xử lý update
    const productVariants = useMemo(() => {
        if (isApiSuccessResponse(record)) {
            return record.data.productVariants
        }
        return []
    }, [record])


    // xử lí biển thể
    const attributeCategoryOptions = useMemo(() => {
        if (attributeCategory && isApiSuccessResponse(attributeCategory.data)) {
            const CategoryData = attributeCategory.data.data as unknown as IProductCatalogue[];
            return [
                ...CategoryData.map((item) => ({
                    value: item.id.toString(),
                    label: item.name
                }))
            ]
        }
    }, [attributeCategory])

    // lấy dataa để xử lí chỉnh sửa sản phẩm biến thể
    const attributeCatalogueUser = useMemo(() => {
        if (isApiSuccessResponse(record) && record.data.productVariants.length > 0) {
            const firstVariant = record.data.productVariants[0]
            if (firstVariant.attributeCatalogues) {
                const ids = firstVariant.attributeCatalogues.map((attrCat) => attrCat.catalogueId)
                return attributeCategoryOptions?.filter(option => ids.includes(parseInt(option.value)))
            }
        }
        return []
    }, [record, attributeCategoryOptions])



    //giữ lại form
    useEffect(() => {
        if (isApiSuccessResponse(record) && !formResetRef.current && isUpdateMode) {
            const formData = {
                ...record.data,
                image: undefined,
                desscription: record.data.description ?? '',
                content: record.data.content ?? '',
                metaTitle: record.data.metaTitle ?? '',
                metaKeyword: record.data.metaKeyword ?? '',
                metaDescription: record.data.metaDescription ?? '',
                canonical: record.data.canonical ?? '',
                made_in: record.data.made_in ?? '',
                code: record.data.code ?? '',
                price_discount: record.data.price_discount ?? '',
                // productVariants: record.data.productVariants.map((variant) => ({
                //     ...variant,
                //     barcode: variant.barcode ?? "",
                //     userId: variant.user_id, // map lại từ snake_case
                // })),

                productCatalogueId: record.data.productCatalogueId?.toString() || '0',
                publish: record.data.publish?.toString() || '2',
                album: [] as File[],
                removeImages: [] as string[],
                // price: record.data.price ? record.data.price.toString() : '',
                // price_discount: record.data.price_discount ? record.data.price_discount.toString() : ''
            }
            // console.log(formData);
            setTimeout(() => {
                form.reset(formData as unknown as TFromValues)
                formResetRef.current = true
            }, 100)
        }
    }, [record, isUpdateMode, form])

    useEffect(() => {
        return () => {
            formResetRef.current = false
        }
    }, [])

    const DataAblum = useMemo(() => {
        if (isApiSuccessResponse(record)) {
            return record.data.album || []
        }
        return []
    }, [record])

    useEffect(() => {
        if (Object.keys(form.formState.errors).length > 0) {
            console.log("❌ Lỗi form:", form.formState.errors);
        }
    }, [form.formState.errors]);


    const isShowVariantUpdate = () => {
        return (isUpdateMode && record && isApiSuccessResponse(record) && record.data.productVariants.length > 0)
    }

    // tức là 2 trường hợp . điều kiện t1 là !isupdatemode là thêm mới hiển thị ra variant
    // t2 là isUpdateModel nhưng phải thỏa mãn productVariants.lenght ===0 (tức là không có biến thể ) cũng render ra variant để thêm mới
    const isShowVariantBox = () => {
        return (!isUpdateMode || isUpdateMode && record && isApiSuccessResponse(record) && record.data.productVariants.length === 0)
    }

    return (
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <div className="flex flex-1 flex-col gap-4 p-4 bg-[#f3f3f4] pt-[20px]">
                        <div className="grid grid-cols-12 gap-4">
                            <div className="col-span-3">
                                {ParentCategoriOptions.length && <Parent name="productCatalogueId" placeholder="Chọn danh mục cha" control={form.control} data={ParentCategoriOptions} />}
                                {/* Chọn nhóm sản phẩm khác */}
                                <CardCatalogue
                                    data={ParentCategoriOptions}
                                    record={record}
                                    control={form.control}
                                    name="productCatalogues"
                                    placeholder="Chọn nhóm sản phẩm khác"
                                    isUpdateMode={isUpdateMode}
                                />
                                {isShowVariantUpdate() && (
                                    <ProductVariantUpdate
                                        productVariants={productVariants}
                                        productName={isApiSuccessResponse(record) ? record.data.name : ''}
                                        productId={isApiSuccessResponse(record) ? record.data.id : 0}
                                        attributeCatalogueUser={attributeCatalogueUser}
                                    />)}
                                {/* Ảnh đại diện */}
                                <Image record={record} control={form.control} name="image" heading="Ảnh đại diện" />
                                <ProductInfo />
                                <Card className="rounded-[5px] pt-[10px] mb-[20px] pb-[15px]">
                                    <CardHeader className="border-b pt-[0px] custom-padding">
                                        <CardTitle className="font-normal uppercase">Thương hiệu sản phẩm</CardTitle>
                                    </CardHeader>
                                    <CardContent className="px-[15px]">
                                        <FormField
                                            control={form.control}
                                            name="brand_id"
                                            render={({ field }) => {
                                                return (
                                                    <FormItem className="w-full">
                                                        <FormLabel>Chọn nhóm thương hiệu</FormLabel>
                                                        <FormControl>
                                                            <Select
                                                                onValueChange={(value) => field.onChange(Number(value))}  // Chuyển giá trị thành number
                                                                value={field.value !== undefined ? field.value.toString() : ''}  // Đảm bảo giá trị là chuỗi khi hiển thị
                                                            >
                                                                <SelectTrigger className="w-full cursor-pointer">
                                                                    <SelectValue placeholder="Chọn nhóm thương hiệu" />
                                                                </SelectTrigger>
                                                                <SelectContent className="w-full">
                                                                    {BrandOptions && BrandOptions.map((item) => (
                                                                        <SelectItem key={item.values} value={item.values.toString()}>
                                                                            {item.label}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                );
                                            }}
                                        />
                                    </CardContent>
                                </Card>


                                {/* Cấu hình nâng cao (publish) */}
                                <CartAdvance control={form.control} advance={advance} />
                            </div>
                            <div className="col-span-9">
                                <Card className="rounded-[5px] pt-[10px] mb-[20px] pb-[15px]">
                                    <CardHeader className="border-b pt-[0px] custom-padding">
                                        <CardTitle className="font-normal uppercase">Thông tin chung</CardTitle>
                                    </CardHeader>
                                    <CardContent className="px-[15px]">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="col-span-2">
                                                <FormField
                                                    control={form.control}
                                                    name="name"
                                                    render={({ field }) => (
                                                        <FormItem className="mb-[20px]">
                                                            <FormLabel>Tiêu đề</FormLabel>
                                                            <FormControl>
                                                                <Input {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 mb-[20px]">
                                            <div className="col-span-2">
                                                <FormField
                                                    control={form.control}
                                                    name="description"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Mô tả ngắn</FormLabel>
                                                            <FormControl>
                                                                <CKEditorComponent className="description" onChange={field.onChange} value={field.value || ''} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="col-span-2">
                                                <FormField
                                                    control={form.control}
                                                    name="content"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Nội dung</FormLabel>
                                                            <FormControl>
                                                                <CKEditorComponent className="content" onChange={field.onChange} value={field.value || ''} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Album data={DataAblum} />

                                {isShowVariantBox() &&
                                    (<Variant
                                        data={attributeCategoryOptions}
                                    />)}

                                <Seo control={form.control} />
                                <div className="mt-[10px] flex justify-end ">
                                    <Button type="submit">Lưu lại</Button>
                                </div>
                            </div>
                        </div>
                    </div >
                </form>
            </Form>
        </>
    )
}

export default ProductsSave



