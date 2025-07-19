import { useQuery } from "@tanstack/react-query"
import { baseService } from "@/services/base.Service"

import { useEffect, useMemo, useState } from "react"
import { buildUrlWithQueryString } from "@/utils/helper"
import type { IPaginate } from "@/interfaces/api.interface"

type IPageModule = 'product_catalogues' | 'products' | 'post_catalogues' | 'posts'

interface IUsePageProps {
    id: string | undefined,
    catalogue: IPageModule,
    object: IPageModule,
    perpage?: number
}


const UseCatalogue = <DC, T>({ id, catalogue, object, perpage = 20 }: IUsePageProps) => {

    // lấy ra nhóm sản phẩm dựa vào id 
    const { data: detailCatalogue, isLoading: detailCatalogueLoading } = useQuery({
        queryKey: [catalogue, id],
        queryFn: () => baseService.show<DC>(catalogue, Number(id)),
        enabled: !!id && Number(id) !== 0
    })



    //(LỌC) lấy ra sản phẩm theo danh mục
    const [queryParams, setQueryParams] = useState<Record<string, string>>({})
    const catalogueKey: string = catalogue?.endsWith('s') ? catalogue.slice(0, -1) + '_id' : catalogue + '_id'


    const fullUrl = useMemo(() => {
        return buildUrlWithQueryString(object, queryParams)
    }, [queryParams, object])


    const { data: details, isLoading: detailLoading } = useQuery({
        queryKey: [object, catalogue, id, queryParams],
        queryFn: () => baseService.paginate<T>(fullUrl),
        enabled: !!catalogue && !!object
    })

    // phân ra đoạn paginate của sản phẩm theo danh mục ra và lấy dữ liệu . có cả phân trang
    const lists = useMemo(() => {
        if (details && 'data' in details) {
            return details.data as unknown as IPaginate<T>
        }
        return null
    }, [details])

    useEffect(() => {
        console.log(details, detailLoading, queryParams, fullUrl, lists);
    }, [details, detailLoading, queryParams, fullUrl])

    // sét dữ liệu lên url
    useEffect(() => {
        if (catalogueKey && id) {
            setQueryParams(prev => ({
                ...prev,
                [catalogueKey]: id,
                //mặc định trang 1
                page: '1',
                // mỗi trang có 2 spham
                // perpage: '2'
                perpage: perpage.toString()
            }))
        }
    }, [catalogueKey, id, perpage])

    // xử lý phân trang để truyền vào hàm app-paginate
    const handlePaginate = (page: number) => {
        setQueryParams(prev => ({
            ...prev,
            page: page.toString()
        }))
    }

    return {
        // trả data nhóm sản phẩm
        detailCatalogue: detailCatalogue?.data,
        detailCatalogueLoading,
        // trả dữ liệu sản phẩm theo nhóm sản phẩm
        lists,
        handlePaginate
    }
}

export default UseCatalogue