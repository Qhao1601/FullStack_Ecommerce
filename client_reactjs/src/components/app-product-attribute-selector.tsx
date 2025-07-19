import type { IProducts, IProductVariant, TAttributes } from "@/interfaces/products/products.interface"
import { memo, useEffect, useState } from "react"


interface IAppProductAttributeSelectorProps {
    product: IProducts,
    onVariantChange: (variant: IProductVariant | null) => void
}
interface ISelectedAttributes {
    [catalogueId: number]: number
}

interface IAvailableOptions {
    [catalogueId: number]: TAttributes[]
}

const AppProductAttributeSelector = ({ product, onVariantChange }: IAppProductAttributeSelectorProps) => {

    const [selectedAttributes, setSelectedAttributes] = useState<ISelectedAttributes>({})
    const [selectedVariant, setSelectedVariant] = useState<IProductVariant | null>(null)
    const [availableOptions, setAvailableOptions] = useState<IAvailableOptions>({})

    // đổ thuộc tính ra theo nhóm thuộc tính
    useEffect(() => {
        const initOptions: IAvailableOptions = {}
        product.availableAttributes?.forEach(catalogue => {
            initOptions[catalogue.catalogueId] = catalogue.attributes
        })
        setAvailableOptions(initOptions)
    }, [product])

    // lấy ra những cặp thuộc tính đã chọn
    const handleclickAttribute = (catalogueId: number, attributeId: number) => {
        // console.log(catalogueId)
        const newOptions: ISelectedAttributes = { ...selectedAttributes }
        if (newOptions[catalogueId] === attributeId) {
            delete newOptions[catalogueId]
        } else {
            newOptions[catalogueId] = attributeId
        }
        setSelectedAttributes(newOptions)
    }

    // group lại  những cặp thuộc tính đã chọn có trong productVariant (phiên bản sản phẩm ) và trả về ra thuộc tính
    useEffect(() => {
        if (Object.keys(selectedAttributes).length === 0) {
            setSelectedVariant(null)
            return
        }
        const matchingVariant = product.productVariants?.find((variant) => {
            const variantAttributes = variant.attributes || []
            const selectedAttributeIds = Object.values(selectedAttributes)
            return selectedAttributeIds.every(attrId => variantAttributes.includes(attrId) &&
                // ktra nếu chọn đủ thuộc tính hết mới bắt được giá trị
                variantAttributes.length === selectedAttributeIds.length)
        })
        if (matchingVariant) {
            setSelectedVariant(matchingVariant)
        }
    }, [selectedAttributes, product.productVariants])

    useEffect(() => {
        if (onVariantChange) {
            onVariantChange(selectedVariant)
        }
    }, [selectedVariant, onVariantChange])


    if (!product.availableAttributes || product.availableAttributes.length === 0) return null

    return (
        <>
            <div className="space-y-6">
                {product.availableAttributes.map((catalogue) => (
                    <div key={catalogue.catalogueId} className="space-y-3">
                        <h3 className="font-semibold text-[15px] text-gray-800">
                            {catalogue.catalogueName}
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {availableOptions[catalogue.catalogueId]?.map((attribute) => {
                                const isSelected = selectedAttributes[catalogue.catalogueId] === attribute.id

                                return (
                                    <button key={attribute.id}
                                        onClick={() => handleclickAttribute(catalogue.catalogueId, attribute.id)}
                                        className={`px-4 py-2 rounded-[5px] border-2 transition-all duration-200 ${isSelected
                                            ? 'border-blue-400 text-white bg-blue-600'
                                            : 'border-gray-300 hover:border-gray-400 text-gray-700'}`}>
                                        {attribute.name}
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}


export default memo(AppProductAttributeSelector)