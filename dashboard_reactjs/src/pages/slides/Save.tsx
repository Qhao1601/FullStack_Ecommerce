import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { useCurd } from "@/hooks/useCrud";
import { ISlides, ISlidesRequest, ISlideItem } from "@/interfaces/slides/slides.interface";
import useApi from "@/hooks/useApi";
import { useParams } from "react-router-dom";
import { useEffect, useMemo, useRef } from "react";
import { isApiSuccessResponse } from "@/interfaces/api.response";
import { Trash2 } from "lucide-react";
import { useFieldArray } from "react-hook-form";
import CarImageProps from "@/components/imageProps";
import { Textarea } from "@/components/ui/textarea";
import { getFullImageUrl } from "@/utils/helper";


const itemSchema = z.object({
    image: z.any().refine((file) => !!file, { message: "Bạn phải chọn hình ảnh" }),
    description: z.string().optional(),
    fullPath: z.string().optional()
});

const createSchema = z.object({
    id: z.number().optional(),
    name: z.string().min(1, { message: 'Từ khóa của quyền bắt buộc' }),
    keyword: z.string().min(1, { message: 'Bạn phải nhập từ khóa' }),
    publish: z.string().min(1, { message: "Bạn phải chọn trạng thái" }),
    description: z.string().min(1, { message: "Bạn phải nhập mô tả " }),
    short_code: z.string().optional(),
    setting: z.string().optional(),
    item: z.array(itemSchema)
});

const formConfig = (isUpdateMode: boolean) => ({
    schema: createSchema,
    defaultValues: {
        id: undefined,
        name: "",
        keyword: "",
        description: "",
        item: [],
        short_code: "",
        setting: "",
        publish: "2",
    },
    createTitle: "Thêm mới slides",
    updateTitle: "Chỉnh sửa slides",
    endpoint: "/v1/slides",
    routerIndex: "/slides",
    mapToRequest: (values: TFromValues, userId?: number): ISlidesRequest => {
        const formData = new FormData();

        // Gửi từng item như: slide[description][], slide[image][]
        values.item.forEach((item, index) => {
            formData.append(`slide[${index}][description]`, item.description || '');

            if (item.image instanceof File) {
                formData.append(`slide[${index}][image]`, item.image);
            } else if (typeof item.image === 'string') {
                formData.append(`slide[${index}][image_old]`, item.image);
            } else {
                formData.append(`slide[${index}][image_old]`, '');
            }
        });


        // Gửi các field cơ bản
        const fields = ["name", "keyword", "publish", "description", "short_code", "setting"];
        fields.forEach((key) => {
            const v = values[key as keyof TFromValues];
            if (v != null) formData.append(key, v as string);
        });

        // Nếu đang chỉnh sửa thì thêm _method = PUT
        if (values?.id) {
            formData.append("_method", "PUT");
        }

        console.log("📦 FormData gửi đi:");
        for (let pair of formData.entries()) {
            console.log(`${pair[0]}:`, pair[1]);
        }

        return formData as unknown as ISlidesRequest;
    }

});

export type TFromValues = z.infer<typeof createSchema>;

const SlidesSave = () => {
    const api = useApi();
    const { id } = useParams();
    const isUpdateMode = !!id;
    const { onSubmit, form, record } = useCurd<ISlides, ISlidesRequest, TFromValues>(formConfig(isUpdateMode));
    const formResetRef = useRef<boolean>(false);
    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "item"
    });


    useEffect(() => {
        if (isUpdateMode && record && isApiSuccessResponse(record) && !formResetRef.current) {
            const data = record.data

            form.reset({
                id: data.id,
                name: data.name,
                keyword: data.keyword,
                description: data.description,
                short_code: data.short_code ?? "",
                setting: data.setting ?? "",
                publish: String(data.publish),
                item: data.item.map((item) => ({
                    image: item.image,
                    description: item.description,
                    fullPath: item.fullPath
                }))
            });

            formResetRef.current = true;
        }
    }, [record, isUpdateMode, form])



    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="flex flex-col gap-4 p-4 bg-[#f3f3f4]">
                    <div className="grid grid-cols-12 gap-4">
                        <div className="col-span-9">
                            <Card className="mb-4 rounded">
                                <CardHeader className="border-b">
                                    <CardTitle className="font-normal uppercase">Hình ảnh slides</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {fields.map((field, index) => (
                                        <div key={field.id} className="grid grid-cols-12 gap-4 mb-4">
                                            <div className="col-span-4">
                                                {/* <CarImageProps
                                                    control={form.control}
                                                    name={`item.${index}.image`}
                                                    heading="Ảnh đại diện"
                                                    imageValue={form.watch(`item.${index}.image`)}
                                                /> */}
                                                <CarImageProps
                                                    control={form.control}
                                                    name={`item.${index}.image`}
                                                    heading="Ảnh đại diện"
                                                    imageValue={
                                                        typeof form.watch(`item.${index}.image`) === 'string'
                                                            ? form.watch(`item.${index}.fullPath`)
                                                            : form.watch(`item.${index}.image`)
                                                    }
                                                />
                                            </div>
                                            <div className="col-span-7">
                                                <FormField
                                                    control={form.control}
                                                    name={`item.${index}.description`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Mô tả</FormLabel>
                                                            <FormControl>
                                                                <Textarea
                                                                    placeholder="Nhập mô tả hình ảnh"
                                                                    className="resize-none"
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                            <div className="flex items-center col-span-1">
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => remove(index)}
                                                >
                                                    <Trash2 size={16} />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                    <div className="mt-4">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => append({ image: undefined, description: "" })}

                                        >
                                            Thêm ảnh
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                        <div className="col-span-3">
                            <Card className="mb-4 rounded">
                                <CardHeader className="border-b">
                                    <CardTitle className="font-normal uppercase">Thông tin chung</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem className="mb-4">
                                                <FormLabel>Tiêu đề</FormLabel>
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="keyword"
                                        render={({ field }) => (
                                            <FormItem className="mb-4">
                                                <FormLabel>Từ khóa</FormLabel>
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="description"
                                        render={({ field }) => (
                                            <FormItem className="mb-4">
                                                <FormLabel>Mô tả</FormLabel>
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
                <div className="flex justify-end px-4">
                    <Button type="submit">Lưu lại</Button>
                </div>
            </form>
        </Form>
    );
};

export default SlidesSave;
