import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import * as z from "zod"
import { Button } from "@/components/ui/button";
import { useCurd } from "@/hooks/useCrud";
import { IAttributeCatalogues, IAttributeCatalogueRequest } from "@/interfaces/attributes/attributeCatalogues.interface";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { isApiSuccessResponse } from "@/interfaces/api.response";


const createSchema = z.object({
    name: z.string().min(1, { message: 'Bạn phải nhập nhóm thuộc tính' }),
    // dataType: z.string().optional(),
    // unit: z.string().optional(),

})
const formConfig = {
    schema: createSchema,
    defaultValues: {
        name: '',
        // dataType: '',
        // unit: '',
    },
    createTitle: 'Thêm mới thương hiệu',
    updateTitle: 'Chỉnh sửa thành viên',
    endpoint: '/v1/attribute_catalogues',
    routerIndex: '/attribute_catalogues',
    mapToRequest: (values: {
        name: string,
    }, userId?: number): IAttributeCatalogueRequest => ({
        ...values,
        userId
    })
}

export type TFromValues = z.infer<typeof formConfig.schema>

const AttributeCatalogueSave = () => {

    const { id } = useParams()
    const isUpdateMode = !!id
    const { onSubmit, form, record } = useCurd<IAttributeCatalogues, IAttributeCatalogueRequest, TFromValues>(formConfig)


    // render lại nhóm bài viết khi bị reload trang
    useEffect(() => {
        if (record && isApiSuccessResponse(record) && isUpdateMode) {
            form.reset(record.data as unknown as TFromValues)
        }
    }, [form, record, isUpdateMode])

    const { formState: { errors } } = form
    useEffect(() => {
        if (Object.keys(form.formState.errors).length > 0) {
            console.log("❌ Lỗi form:", form.formState.errors);
        }
    }, [form.formState.errors]);


    return (
        <>
            <div className="flex flex-1 flex-col gap-4 p-4 bg-[#f3f3f4] pt-[20px]">
                <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-5">
                        <h2 className="mb-[20px] text-[20px] font-semibold uppercase">Chú ý</h2>
                        <p className="mb-[10px]">Nhập đầy đủ các thông tin bên dưới đây</p>
                        <p>Lưu ý: Các trường đánh dấu <span className="text-[#f00000]">(*)</span> là bắt buộc</p>
                    </div>
                    <div className="col-span-7">
                        <Card className="rounded-[5px]">
                            <CardHeader className="border-b">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle>Thông tin chung</CardTitle>
                                        <CardDescription className="text-[#f00000]">Nhập đầy đủ các trường thông tin bên dưới</CardDescription>
                                    </div>


                                </div>

                            </CardHeader>
                            <CardContent>
                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="col-span-1">
                                                <FormField
                                                    control={form.control}
                                                    name="name"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Tên nhóm thuộc tính</FormLabel>
                                                            <FormControl>
                                                                <Input {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        </div>


                                        <div className="mt-[20px]">
                                            <Button type="submit" className="text-[13px] font-light " > Lưu lại</Button>
                                        </div>
                                    </form>
                                </Form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div >
        </>
    )
}

export default AttributeCatalogueSave