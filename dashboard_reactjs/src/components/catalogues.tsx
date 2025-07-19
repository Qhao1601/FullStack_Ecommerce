
import {
    Card,
    CardContent,

    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { MultiSelect } from "@/components/multi-select";
import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form"
import { memo, ReactElement, useEffect, useState } from "react";
import { ISelectOptionItem } from "@/config/constans";
import { IApiResponse, isApiSuccessResponse } from "@/interfaces/api.response";
import { Control, FieldPath, FieldValues } from "react-hook-form";

interface IRecordData {
    [key: string]: number[]
}

interface ICatalogueProps<T extends FieldValues = FieldValues> {
    data: ISelectOptionItem[]
    control: Control<T, unknown>,
    name: FieldPath<T>,
    placeholder: string,
    record: IApiResponse<IRecordData, unknown> | undefined,
    isUpdateMode?: boolean
}


const CardCatalogue = <T extends FieldValues = FieldValues>(props: ICatalogueProps<T>): ReactElement => {
    const { data, record, control, name, placeholder, isUpdateMode } = props

    // selectmutiple
    const [multipleSelectKey, setMultipleSelectKey] = useState<number>(0)
    const [selectCatalogues, setSelectCatalogues] = useState<string[]>([])


    useEffect(() => {
        if (isApiSuccessResponse(record) && isUpdateMode) {
            const productCatalogueStr: string[] = record.data[name].map((id: number) => id.toString())
            setSelectCatalogues(productCatalogueStr)
            setMultipleSelectKey(prev => prev + 1)
        }
    }, [record, name, isUpdateMode])

    return (
        <>
            <Card className="rounded-[5px] pt-[10px] mb-[20px] pb-[15px]">
                <CardHeader className="border-b pt-[0px] custom-padding">
                    <CardTitle className="font-normal leading-snug uppercase">{placeholder}</CardTitle>
                </CardHeader>
                <CardContent className="px-[15px]">
                    <FormField
                        control={control}
                        name={name}
                        render={({ field: { onChange } }) => (
                            <FormItem>
                                <FormControl>
                                    <MultiSelect
                                        key={multipleSelectKey}
                                        options={data}
                                        onValueChange={(values) => {
                                            setSelectCatalogues(values)
                                            onChange(values.map(val => Number(val)))
                                        }}
                                        defaultValue={selectCatalogues}
                                        placeholder={placeholder}
                                        variant="inverted"
                                        animation={2}
                                        maxCount={3}
                                    />
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

const Catalogue = memo(CardCatalogue) as <T extends FieldValues = FieldValues>(props: ICatalogueProps<T>) => ReactElement;

export default Catalogue;