import { useParams } from "react-router"
import UseObject from "@/hook/use-object";
import type { IPosts } from "@/interfaces/post/posts.interface";
import AppSafeHtml from "@/components/app-sate-content";


const Posts = () => {
    const params = useParams();
    const { id } = params
    const { object } = UseObject<IPosts>({ id, module: 'posts' })
    return (
        <>
            <div id="product-catalogue" className="py-[30px]">
                <div className="container">
                    {/*  lấy dữ liệu nhóm sản phẩm render ra tên nhóm */}
                    <h1 className="heading-1 font-bold text-[30px] mb-[20px] hover:text-[#629d23] uppercase text-center">
                        {object?.name}
                    </h1>
                    {object?.description && (
                        <div className="description">
                            <AppSafeHtml html={object?.description} className="font-semibold" />
                        </div>
                    )}
                    {object?.content && (
                        <div className="content">
                            <AppSafeHtml html={object?.content} className="font-semibold" />
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default Posts