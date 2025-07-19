import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useEffect, useState } from "react"

interface IPerpagePros {
    onChange?: (value: number) => void, //  callback khi chọn number
    defaulvalue?: number // giá trị mặc định
}

export const Perpage = ({ onChange, defaulvalue = 10 }: IPerpagePros) => {

    const [perpage, setPerpage] = useState(defaulvalue);
    // truyền value là number mình chọn
    const handleChange = (value: string) => {
        // ép kiểu về kiểu số
        const numberValue = parseInt(value)
        // cập nhật lại giá trị perpage khi mình đã chọn
        setPerpage(numberValue)
        // gọi lại giá trị cha để cập nhật lại biết khi mình vừa chọn gì
        if (onChange) {
            // number là giá trị mình vựa chọn
            onChange(numberValue)
        }
    }
    // sau đó sử dụng useEffect là tự động nếu defaulvalue thay đổi thi setperpage xét lại giá cho perpage
    useEffect(() => {
        setPerpage(defaulvalue)
    }, [defaulvalue]);



    return (
        <Select value={perpage.toString()} onValueChange={handleChange}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Theme" />
            </SelectTrigger>
            <SelectContent>
                {[5, 10, 15, 20].map((value) => (
                    <SelectItem key={value.toString()} value={value.toString()}>{value.toString()} bản ghi</SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}


// import { useEffect, useState } from "react"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// interface IPerpagePros {
//     onChange?: (value: number) => void, // callback khi chọn number
//     defaulvalue?: number // giá trị mặc định
// }

// export const Perpage = ({ onChange, defaulvalue = 2 }: IPerpagePros) => {
//     const [perpage, setPerpage] = useState(defaulvalue);

//     const handleChange = (value: string) => {
//         const numberValue = parseInt(value);
//         setPerpage(numberValue);

//         // Cập nhật URL mà không làm mới trang
//         if (onChange) {
//             onChange(numberValue);
//         }

//         // Lấy query params hiện tại (page và keyword)
//         const currentUrl = new URL(window.location.href);
//         const keyword = currentUrl.searchParams.get("keyword") || "";

//         // Cập nhật URL mà không làm mới trang
//         const newUrl = new URL(window.location.href);
//         newUrl.searchParams.set("perpage", numberValue.toString());
//         newUrl.searchParams.set("keyword", keyword);

//         // Cập nhật URL mà không điều hướng lại
//         window.history.replaceState({}, "", newUrl.toString());
//     }

//     useEffect(() => {
//         setPerpage(defaulvalue);
//     }, [defaulvalue]);

//     return (
//         <Select value={perpage.toString()} onValueChange={handleChange}>
//             <SelectTrigger className="w-[180px]">
//                 <SelectValue placeholder="Theme" />
//             </SelectTrigger>
//             <SelectContent>
//                 {[2, 4, 5, 40].map((value) => (
//                     <SelectItem key={value.toString()} value={value.toString()}>{value.toString()} bản ghi</SelectItem>
//                 ))}
//             </SelectContent>
//         </Select>
//     );
// }
