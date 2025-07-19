import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { IProducts, IProductVariantResponse } from "@/interfaces/products/products.interface"
import { Search, ChevronRight, Loader2, ChevronLeft, } from "lucide-react"
import React, { useState } from "react"
import { Input } from "./ui/input"
import { Badge } from "./ui/badge"
import { Checkbox } from "./ui/checkbox"
import useApi from "@/hooks/useApi"
// import { isApiSuccessResponse,  } from "@/interfaces/api.response"
import { formatPrice } from "@/utils/helper"
import { isSuccessResponse } from "@/utils/helper"
import { isApiSuccessResponse } from "@/interfaces/api.response"

interface IProductSelectorDialog {
    onProductSelected: (items: selectedProductDiglog[]) => void,
    children: React.ReactNode
}

export interface SelectedItem {
    productId?: number,
    productVariantId?: number
}

export interface selectedProductDiglog {
    id: number,
    type: string,
    name: string,
    code: string | undefined,
    price: number,
}

const ProductSelectorDialog = ({ onProductSelected, children }: IProductSelectorDialog) => {

    const api = useApi()
    const [serachtemr, setSerachtemr] = useState<string>('')
    const [selectProduct, setSelectProduct] = useState<SelectedItem[]>([])
    const [toggleExpand, setExpand] = useState<Set<Number>>(new Set())

    const { data: products, isLoading, isError } = api.usePagiantee<IProducts>('/v1/products', { keyword: serachtemr })

    // tìm kiếm
    const hanleSearchTerm = (keyword: string) => {
        setSerachtemr(keyword)
    }

    const handleToggleExprand = (Product: IProducts) => {
        setExpand(prev => {
            const newSet = new Set(prev)
            if (newSet.has(Product.id)) {
                newSet.delete(Product.id)
            } else {
                newSet.add(Product.id)
            }
            return newSet
        })
    }

    // click vào sản phẩm nào có phiên bản và không có phiên bản . sẽ set lại mảng id vào selectProduct 
    // nếu k có phiên bản filter id theo mảng mới . nếu có phiên bản render ra ds phiên bản
    const handleProductClick = (product: IProducts) => {
        if (product.productVariants.length === 0) {
            const selected = selectProduct.some(id => id.productId === product.id)
            if (selected) {
                setSelectProduct(prev => prev.filter(item => item.productId !== product.id))
            } else {
                setSelectProduct(prev => [...prev, { productId: product.id }])
            }
        } else {
            handleToggleExprand(product)
        }
    }


    // sau khi set được mảng id vào trong selectedProduct thì lọc xem có trùng id mình đang chọn hay k . nếu trùng thì checked
    const isProductSelected = (product: IProducts) => {
        if (product.productVariants.length === 0) {
            return selectProduct.some(item => item.productId === product.id)
        }
        // nếu k trùng lọc tiếp có phiên bản
        else {
            const selectedVariantIds = selectProduct.filter(item => item.productVariantId).map(item => item.productVariantId)
            return product.productVariants.every(variant => selectedVariantIds.includes(variant.id))
        }
    }


    // set variantId(id của phiên bản) vào setSelectProduct 
    const handleVariantClick = (variant: IProductVariantResponse) => {
        const selected = selectProduct.some(item => item.productVariantId === variant.id)
        if (selected) {
            setSelectProduct(prev => prev.filter(item => item.productVariantId !== variant.id))
        } else {
            setSelectProduct(prev => [...prev, { productVariantId: variant.id }])
        }
    }

    // kiểm tra id của phiên bản vừa set trên nếu đó thì checked
    const isVariantSelected = (variantId: number) => {
        if (variantId) {
            return selectProduct.some(item => item.productVariantId === variantId)
        }
    }

    const renderSelectedItem = () => {
        if (!(isApiSuccessResponse(products)) || !('data' in products.data)) return []

        const allProduct = products.data.data
        const selectedNames: string[] = []

        selectProduct.forEach(item => {
            if (item.productId) {
                const product = allProduct.find(p => p.id === item.productId)
                if (product) {
                    selectedNames.push(product.name)
                }
            } else if (item.productVariantId) {
                for (const product of allProduct) {
                    const variant = product.productVariants.find(variant => variant.id === item.productVariantId)
                    if (variant) {
                        selectedNames.push(`${product.name} - ${variant.attributeNames.join('-')}`)
                        break
                    }
                }
            }
        })
        return selectedNames
    }

    // useEffect(() => {
    //     console.log(selectProduct)
    // }, [selectProduct])


    // bắn dữ liệu qua trang khuyến mãi
    const handleconfirm = () => {
        if (!(isApiSuccessResponse(products)) || !('data' in products.data)) return []

        const allProducts = products.data.data
        const selectedProductInfo: selectedProductDiglog[] = []
        selectProduct.forEach(item => {
            if (item.productId) {
                const product = allProducts.find(i => i.id === item.productId)
                if (product) {
                    selectedProductInfo.push({
                        id: product.id,
                        type: 'product',
                        name: product.name,
                        code: product.code,
                        price: product.price,
                    })
                }
            } else if (item.productVariantId) {
                for (const product of allProducts) {
                    const variant = product.productVariants.find(v => v.id === item.productVariantId)
                    if (variant) {
                        selectedProductInfo.push({
                            id: variant.id,
                            type: 'variant',
                            name: `${product.name} - ${variant.attributeNames.join('-')}`,
                            code: variant.sku,
                            price: variant.price,
                        })
                    }
                }
            }
        })
        onProductSelected(selectedProductInfo)
    }


    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                {children}
            </AlertDialogTrigger>
            <AlertDialogContent className="!w-[1000px] !max-w-none rounded-[5px]">
                <AlertDialogHeader>
                    <AlertDialogTitle>Danh sách các sản phẩm </AlertDialogTitle>
                    <AlertDialogDescription>
                        Lựa chọn các sản phẩm trong danh sách dưới đây
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="relative">
                    <Search className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2 size-4" />
                    <Input placeholder="Tìm kiếm theo tên hoặc mã sản phẩm"
                        value={serachtemr}
                        onChange={(e) => hanleSearchTerm(e.target.value)}
                        className="pl-[36px]" />
                </div>
                {isLoading && (
                    <Loader2 className="absolute text-gray-400 transform -translate-y-1/2 right-3 top-1/2 size-4 animate-spin " />
                )}
                <div className="bg-blue-50 p-3 rounded-lg mb-[10px]">
                    <div className="mb-2 text-sm font-medium text-blue-800">
                        Đã chọn {selectProduct.length} sản phẩm
                    </div>
                    {selectProduct.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {renderSelectedItem().map((name, index) => (
                                <Badge key={index} className="text-[15px] rounded-[5px] cursor-pointer">
                                    {name}
                                </Badge>
                            ))}
                        </div>
                    )}
                </div>
                <div className="max-h-[450px] overflow-y-auto space-x-3">
                    {isLoading && (
                        <div className="max-h-[500px] overflow-y-auto space-x-3">
                            <div className="flex items-center justify-center h-32">
                                <div className="text-gray-500">Đang tiến hành tìm kiếm</div>
                            </div>
                        </div>
                    )}
                    {isLoading && isError && (
                        <div className="max-h-[500px] overflow-y-auto space-x-3">
                            <div className="flex items-center justify-center h-32">
                                <div className="text-gray-500">Có lổi trong quá trình tìm kiếm</div>
                            </div>
                        </div>
                    )}

                    {!isLoading && isSuccessResponse(products) && 'data' in products.data && products.data.data.map(item => (
                        <div key={item.id} className="mr-[0px]">
                            <div onClick={() => { handleProductClick(item) }}
                                className={`flex items-center p-4 cursor-pointer transition-colors rounded-[5px] mr-0 mb-[10px] ${isProductSelected(item) ? ' bg-blue-200 hover:bg-blue-300' : ''} `}>
                                <div className="flex items-center mr-[10px] cursor-pointer" onClick={(e) => e.stopPropagation()}>
                                    <Checkbox className="cursor-pointer"
                                        checked={isProductSelected(item)}
                                    />
                                </div>
                                <div className="flex-1 mr-[0px]">
                                    <h3 className="font-medium text-gray-900 text-[14px] flex items-center">
                                        <div> {item.name} </div>
                                        <Badge className="bg-black text-white text-[10px] rouned-[5px] p-[3px] px-[10px] ml-[15px]">
                                            {item.productVariants.length} phiên bản
                                        </Badge>
                                    </h3>
                                    <div className="flex items-center gap-3 mt-[5px]">
                                        <Badge className="text-[10px] rounded-[3px]">SKU: {item.code}</Badge>
                                        <span className="text-blue-600 font-semibold text-[12px]">{formatPrice(String(item.price))}</span>
                                        <div className="text-sm text-gray-500 mt-[0px]">
                                            {item.productVariants.length > 0 && (
                                                <span className="text-blue-600 text-[12px] ">Đã chọn 10 phiên bản</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                {item.productVariants.length === 0 ? (
                                    <Badge className="bg-green text-green-800 border-green-200 text-[15px] ">
                                        Sản phẩm không có phiên bản
                                    </Badge>
                                ) : (
                                    <div className="ml-[4px]">
                                        {toggleExpand.has(item.id) ? (<ChevronRight className="text-gray-400 size-5" />) : (<ChevronLeft className="text-gray-400 size-5" />)}
                                    </div>
                                )}
                            </div>
                            {
                                toggleExpand.has(item.id) && (
                                    <>
                                        {/* load dữ liệu phiên bảng */}
                                        {item.productVariants && item.productVariants.length > 0 && item.productVariants.map(variant => (
                                            <div key={variant.id} className="px-4 pb-4" onClick={(e) => {
                                                e.stopPropagation()
                                                e.preventDefault()
                                                handleVariantClick(variant)
                                            }}>
                                                <div className={`space-y-2 ${isVariantSelected(variant.id) ? 'bg-blue-200 hover:bg-blue-300' : ''}`}>
                                                    <div className="flex items-center p-3 rounded-[3px] border cursor-pointer transition-colors">
                                                        <div className="flex items-center mr-[10px]">
                                                            <Checkbox
                                                                checked={isVariantSelected(variant.id)} />
                                                        </div>
                                                        <div className="flex-1">
                                                            <h4 className="font-medium text-[15px] text-gray-900">
                                                                {`${item.name} - ${variant.attributeNames.join(' - ')}`}
                                                            </h4>
                                                            <div className="items-center flex gap-3 mt-[5px]">
                                                                <Badge variant="outline" className="text-[10px] rounded-[5px]">
                                                                    SKU: {`${item.code} - ${variant.code}`}
                                                                </Badge>
                                                                <span className="text-[15px] text-gray-900">
                                                                    Tồn kho: {variant.stock}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </>
                                )
                            }
                        </div>
                    ))}
                </div>
                <AlertDialogFooter>
                    <AlertDialogCancel>Hủy bỏ</AlertDialogCancel>
                    <AlertDialogAction onClick={handleconfirm}>Xác nhận</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog >
    )

}


export default ProductSelectorDialog