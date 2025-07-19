import { Input } from "./ui/input";
import { Button } from "./ui/button";
import FilterExtra from "./filter-extra";
import { IFilterSelectConfig } from "@/config/constans";
import { memo, useState } from "react";
import { Perpage } from "@/components/perpage"
// import {
//     Select,
//     SelectTrigger,
//     SelectValue,
//     SelectContent,
//     SelectItem,
// } from "@/components/ui/select"
// import { isApiSuccessResponse } from "@/interfaces/api.response"
// import useApi from "@/hooks/useApi";
// import { IPostCatalogue } from "@/interfaces/post/post-catalogues.interface";
// import { IPosts } from "@/interfaces/post/posts.interface"


interface IFilterExtraProps {
    onFilterChange: (filters: Record<string, string>) => void
    extraFilters?: IFilterSelectConfig[]
}


const FilterCommon = ({ onFilterChange, extraFilters }: IFilterExtraProps) => {

    const [keyword, setKeyword] = useState<string>("")
    const [filterValues, setFilterValues] = useState<Record<string, string>>({})

    const handleSearch = () => {
        const filters: Record<string, string> = { ...filterValues }
        if (keyword)
            filters.keyword = keyword
        onFilterChange(filters)
    }

    const handFilterChange = (filterId: string, value: string) => {
        setFilterValues((prevState) => ({
            ...prevState,
            [filterId]: value
        }))
    }


    /*
    ---
    */

    // mới làm 151
    // const api = useApi();
    // const postCatalogues = api.usePagiante<IPostCatalogue[]>('/v1/post_catalogues', { sort: 'lft,asc', type: 'all' })
    // const [catalogues, setCatalogues] = useState<IPostCatalogue[]>([])
    // const [selectedCatalogue, setSelectCatalogue] = useState<Number | null>(null)

    // useEffect(() => {
    //     if (isApiSuccessResponse(postCatalogues.data)) {
    //         const data = postCatalogues.data.data as unknown as IPostCatalogue[]
    //         setCatalogues(data)
    //     }
    // }, [postCatalogues])

    return (
        <>
            <div className="flex">
                <div className="mr-[10px]">
                    <Perpage />
                </div>
                {extraFilters && extraFilters.length > 0 && (
                    <FilterExtra
                        filters={extraFilters}
                        onchange={handFilterChange} />
                )}
                {/* để tạm đang sửa */}
                {/* <div className="w-[200px] mr-[10px]">
                    <Select
                        value={selectedCatalogue?.toString() || ""}
                        onValueChange={(value) => setSelectCatalogue(Number(value))}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="w-[200px]">
                            {catalogues.map((item) => (
                                <SelectItem key={item.id} value={item.id.toString()}>{item.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div> */}
                {/* sdsdsd */}

                <div className="flex items-center w-full max-w-sm space-x-2">
                    <Input
                        value={keyword}
                        onChange={(e) =>
                            setKeyword(e.target.value)
                        }
                        type="text" placeholder="Nhập từ khóa muốn tìm kiếm " className="text-[8px] w-[250px]" />
                    <Button onClick={handleSearch}
                        type="submit" className="rounded-[5px] cursor-pointer bg-[#0088FF] font-light">Tìm kiếm</Button>
                </div>
            </div>
        </>
    );
}
export default memo(FilterCommon)