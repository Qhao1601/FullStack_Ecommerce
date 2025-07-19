import { useParams } from "react-router"
import UseCatalogue from "@/hook/use-catalogue";
import AppPagination from "@/components/app-paginate";
import type { IPostCatalogue, IPosts } from "@/interfaces/post/posts.interface";
import PostItem from "@/components/app-news-item";


const PostCatalogue = () => {
    const params = useParams();
    const { id } = params

    const { detailCatalogue, lists, handlePaginate } =
        UseCatalogue<IPostCatalogue, IPosts>({ id, catalogue: 'post_catalogues', object: 'posts', perpage: 2 })

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
                        {lists && lists.data.length > 0 && lists.data.map((post) => (
                            <PostItem key={post.id} post={post} catName={detailCatalogue?.name || ''} />
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

export default PostCatalogue