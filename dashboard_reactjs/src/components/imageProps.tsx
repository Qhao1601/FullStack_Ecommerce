import { FormField, FormItem, FormControl } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useMemo } from "react"

interface Props {
    control: any;
    name: string;
    heading?: string;
    imageValue: File | string | undefined;
}

const CarImageProps = ({ control, name, heading, imageValue }: Props) => {
    const previewUrl = useMemo(() => {
        if (!imageValue) return '';
        if (typeof imageValue === 'string') {
            return imageValue.startsWith('http') ? imageValue : `${import.meta.env.VITE_APP_URL}/${imageValue}`;
        }
        return URL.createObjectURL(imageValue);
    }, [imageValue]);

    return (
        <div>
            {heading && <p className="mb-2 font-semibold">{heading}</p>}
            {previewUrl && <img src={previewUrl} alt="preview" className="w-full mb-2 rounded" />}
            {/* Input ảnh */}
            <FormField
                control={control}
                name={name}
                render={({ field }) => (
                    <FormItem>
                        <FormControl>
                            {/* <Input type="file" accept="image/*" onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                    field.onChange(e.target.files[0]);
                                }
                            }} /> */}
                            <Input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        field.onChange(file);
                                    } else {
                                        // Giữ nguyên ảnh cũ nếu không chọn ảnh mới
                                        field.onChange(field.value);
                                    }
                                }}
                            />
                        </FormControl>
                    </FormItem>
                )}
            />
        </div>
    );
};

export default CarImageProps;