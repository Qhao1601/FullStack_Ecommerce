import {
    Card,
    CardContent,

    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { IApiResponse } from "@/interfaces/api.response"
import { ReactElement, memo } from "react"
import { Control, FieldPath, FieldValues } from "react-hook-form"
import { isApiSuccessResponse } from "@/interfaces/api.response"

// cái bthg
interface IImageData {
    [key: string]: string
}
// sữa ở slide
// interface IImageData {
//     [key: string]: string | { url: string }
// }
interface ICarImageProps<T extends FieldValues = FieldValues> {
    record: IApiResponse<IImageData, unknown> | undefined,
    control: Control<T, unknown>
    name: FieldPath<T>,
    heading: string,
}

const CarImage = <T extends FieldValues = FieldValues>(props: ICarImageProps<T>): ReactElement => {
    const { record, control, name, heading } = props
    return (
        <>
            <Card className="rounded-[5px] pt-[10px] mb-[20px] pb-[15px]">
                <CardHeader className="border-b pt-[0px] custom-padding">
                    <CardTitle className="font-normal uppercase">{heading}</CardTitle>
                </CardHeader>
                <CardContent className="px-[15px]">
                    <FormField
                        control={control}
                        name={name}
                        render={({ field: { ref, onChange } }) => (
                            <FormItem>
                                <FormControl>
                                    <div className="grid w-full max-w-sm items-center gap-1.5">
                                        <Input id={name} type="file"
                                            ref={ref}
                                            onChange={(e) => {
                                                const files = e.target.files && e.target.files.length > 0 ? e.target.files[0] : undefined
                                                onChange(files)
                                            }}
                                        />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {isApiSuccessResponse(record) &&
                        <div className="h-[280px] mt-[10px]">
                            <img className="object-cover size-full " src={record.data[name]} alt="" />
                        </div>
                    }
                    {/* {isApiSuccessResponse(record) &&
                        <div className="h-[280px] mt-[10px]">
                            <img
                                className="object-cover size-full"
                                src={typeof record.data[name] === 'string' ? record.data[name] : (record.data[name]?.url || '')}
                                alt=""
                            />
                        </div>
                    } */}

                </CardContent>
            </Card>

        </>
    )
}

const Image = memo(CarImage) as <T extends FieldValues = FieldValues>(props: ICarImageProps<T>) => ReactElement

export default Image