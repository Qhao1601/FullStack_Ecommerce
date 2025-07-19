
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { MultiSelect } from "@/components/multi-select";
import { useCallback, useMemo, useState } from "react";
import useApi from "@/hooks/useApi";
import { isApiSuccessResponse } from "@/interfaces/api.response";
import { IAttributes } from "@/interfaces/attributes/attributeCatalogues.interface";
import { ISelectOptionItem } from "@/config/constans";
import { Trash2 } from "lucide-react";


interface VariantItem {
    data: ISelectOptionItem[] | undefined,
    onAttributeCatalogueChange: (oldValue: string, newValue: string) => void,
    selectAttributeCatalogue: string[],
    onRemove: () => void,
    onAttributeChange: (attributeCatalogueId: string, attributeIds: string[], attributeName: string[]) => void
}

const VariantItem = ({
    data,
    onAttributeCatalogueChange,
    selectAttributeCatalogue,
    onRemove,
    onAttributeChange
}: VariantItem) => {

    const api = useApi();
    const [multipleSelectKey, setMultipleSelectKey] = useState<number>(0);
    const [attributeCatalogueSelected, setAttributeCatalogueSelected] = useState<string>('');
    // xử lý defaultvalue của multiable
    const [selectAttributes, setSelectAttributes] = useState<string[]>([])
    const attributes = api.usePagiante<IAttributes[]>('/v1/attributes', { type: 'all', 'attributeCatalogueId': attributeCatalogueSelected }, { enable: Number(attributeCatalogueSelected) > 0 })

    // lấy ra danh sách thuộc tính
    const attributeOptions = useMemo(() => {
        if (isApiSuccessResponse(attributes.data)) {
            const attributeData = attributes.data.data
            return [
                ...attributeData.map((item) => (
                    {
                        value: item.id.toString(),
                        label: item.name
                    }
                ))
            ]
        }
        return []
    }, [attributes])

    // xử lý giá trị đã chọn và disaple
    const handleAttributeCatalogue = useCallback((value: string) => {
        const oldValue = attributeCatalogueSelected
        setAttributeCatalogueSelected(value),
            onAttributeCatalogueChange(oldValue, value)
        setSelectAttributes([])
        setMultipleSelectKey(prev => prev + 1)
    }, [attributeCatalogueSelected, onAttributeCatalogueChange])


    // xóa thuộc tính
    const handleRemove = useCallback((e: React.MouseEvent) => {
        e.stopPropagation()
        e.preventDefault()
        if (attributeCatalogueSelected) {
            onAttributeCatalogueChange(attributeCatalogueSelected, '')
        }
        onRemove()
    }, [attributeCatalogueSelected, onAttributeCatalogueChange, onRemove])

    // xử lý khi chọn thuộc tính render ra  bảng ds thuộc tính 
    const handleAttribute = useCallback((values: string[]) => {
        setSelectAttributes(values)
        const attributeNames = values.map(value => {
            const options = attributeOptions.find(opt => opt.value === value)
            return options ? options.label : ''
        }).filter(Boolean)
        onAttributeChange(attributeCatalogueSelected, values, attributeNames)
    }, [attributeOptions, attributeCatalogueSelected, onAttributeChange])


    return (
        <div className="mb-6px p-x6">
            <div className="flex items-start py-2 ">
                <div className="w-1/4 pr-4">
                    <div className="relative">
                        <Select onValueChange={(value) => handleAttributeCatalogue(value)}>
                            <SelectTrigger className="w-full !h-[39px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {data && data.map((option) => (
                                    <SelectItem
                                        key={option.value}
                                        value={option.value.toString()}
                                        disabled={selectAttributeCatalogue.includes(option.value.toString())}
                                    >
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div className="w-3/4">
                    <div className="flex items-start">
                        <div className="pr-4 w-9/10">
                            <MultiSelect
                                key={multipleSelectKey}
                                options={attributeOptions}
                                onValueChange={(values) => handleAttribute(values)}

                                defaultValue={selectAttributes}
                                placeholder="Chọn thuộc tính"
                                variant="inverted"
                                animation={2}
                                maxCount={10}
                            />
                        </div>
                        <div className="flex items-center justify-center w-1/10">
                            <button
                                type="button"
                                className="flex items-center justify-center text-white transition-colors duration-200 bg-red-500 rounded-lg w-9 h-9 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300"
                                onClick={handleRemove}
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}


export default VariantItem