import { useParams } from "react-router"
import UseCatalogue from "@/hook/use-catalogue";
import type { IProductCatalogue } from "@/interfaces/products/product-catalogues.interface";
import type { IProducts } from "@/interfaces/products/products.interface";
// import { useEffect } from "react";
import ProductItem from "@/components/app-product";
import AppPagination from "@/components/app-paginate";


const ProductCatalogue = () => {
    const params = useParams();
    const { id } = params

    const { detailCatalogue, lists, handlePaginate } =
        UseCatalogue<IProductCatalogue, IProducts>({ id, catalogue: 'product_catalogues', object: 'products', perpage: 2 })

    // useEffect(() => {
    //     console.log(params.slug)
    // }, [params])

    return (
        <>
            <div id="product-catalogue" className="py-[30px]">
                <div className="container">
                    {/*  lấy dữ liệu nhóm sản phẩm render ra tên nhóm */}
                    <h1 className="heading-1 font-bold text-[30px] mb-[20px] hover:text-[#629d23] uppercase text-center">
                        {detailCatalogue?.name}
                    </h1>
                    {/* lấy dữ liệu sản phẩm thuộc nhóm danh mục sản phẩm vừa chọn */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-8 mt-6">
                        {lists && lists.data.length > 0 && lists.data.map((product) => (
                            <ProductItem key={product.id} product={product} />
                        ))}
                    </div>

                    {lists?.links && lists.links.length > 0 && (
                        <div id="pagination">
                            <AppPagination links={lists.links} currentPage={lists.current_page} onPageChange={handlePaginate} />
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default ProductCatalogue