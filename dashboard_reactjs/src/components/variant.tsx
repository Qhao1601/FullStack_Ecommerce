import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { ISelectOptionItem } from "@/config/constans";
import VariantItem from "./variantItem";
import { useState, useMemo, useCallback, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Input } from "./ui/input";
import { useFormContext } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { useSelector } from "react-redux";
import { RootState } from "@/stores";

interface variant {
    data: ISelectOptionItem[] | undefined,
}

interface IAttributeSelect {
    attributeCatalogueId: string,
    attributeCatalogueName?: string,
    attributeIds: string[],
    attributeNames: string[]
}

interface GenerateVariant {
    id: string,
    combination: string[],
    combinationString: string,
    sku: string,
    price: string | number,
    stock: number,
    code: string,
    uuid: string,
    barcode: string,
    publish: number,
    idCombination: string[]
}


const generateId = () => `variant-${Date.now()}-${Math.floor(Math.random() * 1000)}`

const Variant = ({
    data,
}: variant) => {
    // hiển thị thuộc tính
    const [hasVariants, setHasVariants] = useState<boolean>(false)

    const [variantItems, setVariantItems] = useState<string[]>([generateId()])

    const [selectAttributeCatalogue, setSelectAttributeCatalogue] = useState<string[]>([])

    // xử lý khi chọn thuộc tính render ra  bảng ds thuộc tính 
    const [attributeSelections, setAttributeSelections] = useState<Record<string, IAttributeSelect>>({})
    const [generateVariants, setGenerateVariants] = useState<GenerateVariant[]>([])
    const { getValues, setValue } = useFormContext();
    const code = getValues('code')
    const price = getValues('price')
    const auth = useSelector((state: RootState) => state.auth)

    const handleAddVariantItem = useCallback(() => {
        setVariantItems((prev => [...prev, generateId()]))
    }, [])

    const totalQuantity = useMemo(() => {
        return data?.length || 0
    }, [data])

    const ExistsQuantity = useMemo<boolean>(() => {
        return variantItems.length < totalQuantity
    }, [variantItems, totalQuantity])


    const handleAttributeCatalogueSelected = useCallback((oldValue: string, newValue: string) => {
        setSelectAttributeCatalogue(prev => {
            const update = [...prev]
            if (oldValue) {
                const index = update.indexOf(oldValue)
                if (index !== -1) {
                    update.splice(index, 1)
                }
            }
            if (newValue) {
                update.push(newValue)
            }
            return update
        })
    }, [])

    const handleRemove = useCallback((itemId: string) => {
        setVariantItems(prev => (prev.filter(id => id !== itemId)))
        setAttributeSelections(prev => {
            const newSelections = { ...prev }
            const itemRemove = newSelections[itemId]
            delete newSelections[itemId]
            if (itemRemove.attributeCatalogueId) {
                setSelectAttributeCatalogue(prevSelected => prevSelected.filter(id => id !== itemRemove.attributeCatalogueId))
            }
            return newSelections
        })
    }, [])


    // xử lý khi chọn thuộc tính render ra  bảng ds thuộc tính 
    const handleAttributes = (itemId: string, attributeCatalogueId: string, attributeIds: string[], attributeNames: string[]) => {
        setAttributeSelections(prev => ({
            ...prev,
            [itemId]: {
                attributeCatalogueId,
                attributeIds,
                attributeNames
            }
        }))
    }

    const generateVariantCombinations = useCallback((attributeSelections: IAttributeSelect[]) => {
        if (attributeSelections.length === 0) return { nameCombinations: [], idCombinations: [] }
        const attributeNameArrays = attributeSelections.map(selection => selection.attributeNames)
        const attributeIdsArrays = attributeSelections.map(selection => selection.attributeIds)

        if (attributeNameArrays.length === 1 && attributeIdsArrays.length === 1) {
            return {
                nameCombinations: attributeNameArrays[0].map(attr => [attr]),
                idCombinations: attributeIdsArrays[0].map(attr => [attr])
            }
        }
        const combine = (arrays: string[][]): string[][] => {
            if (arrays.length === 0) return [[]]
            const [first, ...rest] = arrays
            const restCombines = combine(rest)
            return first.flatMap(item => restCombines.map(com => [item, ...com]))
        }
        return {
            nameCombinations: combine(attributeNameArrays),
            idCombinations: combine(attributeIdsArrays)
        }
    }, [])




    useMemo(() => {
        if (!hasVariants) {
            setGenerateVariants([])
            return
        }
        // bỏ qua các thuộc tính chưa chọn hoặc chọn rỗng
        const validSelections = Object.values(attributeSelections).filter(
            selection => selection.attributeCatalogueId && selection.attributeNames.length > 0
        )
        if (validSelections.length === 0) {
            setGenerateVariants([])
        }
        const { nameCombinations, idCombinations } = generateVariantCombinations(validSelections)
        const newVariants = nameCombinations.map((combination, index) => {
            const combinationString = combination.join(' - ');
            const idCombination = idCombinations[index]

            const sortIds = [...idCombination].sort((a, b) => Number(a) - Number(b))

            const sku = `SKU-${code}-${idCombination.join('-')}`;
            return {
                id: `generate-variant-${index}`,
                uuid: uuidv4(),
                code: sortIds.join('_'),
                barcode: 'Test-barcode',
                sku,
                price: price,
                stock: 0,
                combination,
                combinationString,
                idCombination,
                publish: 2,
            }
        })
        setGenerateVariants(newVariants)
    }, [attributeSelections, hasVariants, generateVariantCombinations])

    // useEffect(() => {
    //     console.log(generateVariants)
    // }, [generateVariants])


    useEffect(() => {
        const productVariants = [
            ...generateVariants.map(variant => ({
                uuid: variant.uuid,
                userId: auth.user?.id,
                code: variant.code,
                stock: variant.stock,
                sku: variant.sku,
                price: variant.price,
                barcode: variant.barcode,
                publish: 2,
                attributes: variant.idCombination.map(id => Number(id))
            }))
        ]
        setValue('productVariants', productVariants, { shouldValidate: true, })
    }, [generateVariants, auth])


    return (
        <>
            <Card className={`${hasVariants === false ? '!pb-[0px]' : ''}rounded-[5px] pt-[10px] mb-[20px] pb-[15px]`}>
                <CardHeader className="border-b pt-[0px] custom-padding">
                    <CardTitle className="font-normal ">
                        <div className="mb-[10px] pb-[10px] uppercase">
                            Biến thể
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox id="terms1"
                                className="relative top-[-2px]"
                                checked={hasVariants}
                                onCheckedChange={(checked: boolean) => {
                                    setHasVariants(checked)
                                }} />
                            <label
                                htmlFor="terms1"
                                className="text-sm font-normal leading-none text-center peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Sản phẩm này có nhiều biển thể . vd Kích thước, màu sắc, dung lượng
                            </label>
                        </div>
                    </CardTitle>
                </CardHeader>
                {hasVariants && (
                    <>
                        <CardContent>
                            <div className="flex">
                                <div className="w-1/4 text-sm font-medium text-gray-500">Trạng thái</div>
                                <div className="w-3/4 text-sm font-medium text-gray-500">Thuộc tính</div>
                            </div>
                            {variantItems.map((itemId) => (
                                <VariantItem
                                    data={data}
                                    key={itemId}
                                    onAttributeCatalogueChange={handleAttributeCatalogueSelected}
                                    selectAttributeCatalogue={selectAttributeCatalogue}
                                    onRemove={() => handleRemove(itemId)}
                                    onAttributeChange={(attributeCatalogueId, attributeIds, attributeName) => handleAttributes(itemId, attributeCatalogueId, attributeIds, attributeName)}
                                />
                            ))}
                        </CardContent>
                        <CardFooter>
                            {ExistsQuantity && <div className="font-light text-blue-500 cursor-pointer "
                                onClick={handleAddVariantItem}>
                                + Chọn thêm thuộc tính</div>}
                        </CardFooter>
                    </>
                )}
            </Card>
            {hasVariants && (
                <Card className="rounded-[5px] pt-[10px] mb-[20px]  !pb-[0px]">
                    <CardHeader className="border-b pb-[10px] custom-padding ">
                        <CardTitle className="font-normal uppercase">Danh sách biến thể</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Phiên bản</TableHead>
                                    <TableHead>SKU</TableHead>
                                    <TableHead>Giá</TableHead>
                                    <TableHead>Tồn</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {generateVariants && generateVariants.map((variant) => (
                                    <TableRow key={variant.id}>
                                        <TableCell>
                                            {variant.combinationString}
                                        </TableCell>
                                        <TableCell>
                                            <Input
                                                type="text"
                                                value={variant.sku}
                                                onChange={(e) => {
                                                    const newVariants = generateVariants.map(v => v.id === variant.id ? { ...v, sku: e.target.value } : v)
                                                    setGenerateVariants(newVariants)
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Input
                                                type="text"
                                                value={variant.price}
                                                onChange={(e) => {
                                                    const newPrice = Number(e.target.value)
                                                    const newVariants = generateVariants.map(v => v.id === variant.id ? { ...v, price: newPrice } : v)
                                                    setGenerateVariants(newVariants)
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Input
                                                type="text"
                                                value={variant.stock}
                                                onChange={(e) => {
                                                    const newVariants = generateVariants.map(v => v.id === variant.id ? { ...v, stock: parseInt(e.target.value) } : v)
                                                    setGenerateVariants(newVariants)
                                                }}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}

        </>
    )
}


export default Variant
