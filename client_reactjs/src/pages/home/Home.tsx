import { useQuery } from "@tanstack/react-query"
import ProductCatalogueService from "@/services/products/product_catalogue.service"
import { useMemo } from "react"
import HomeCategory from "@/components/home-category"
import type { IProductCatalogueHome } from "@/interfaces/products/product-catalogues.interface"
import HomeSlide from "@/components/home-silde"
import PostCatalogueService from "@/services/posts/post_catalogue.service"
import type { IPostCatalogue } from "@/interfaces/post/posts.interface"
import HomePost from "@/components/home-post"
import BannerItem from "@/components/banner-item"

import banner1 from "@/assets/banner 1.jpg"
import banner2 from "@/assets/banner 2.jpg"



const Home = () => {

    const banerData = useMemo(() => [
        {
            id: 1,
            image: banner1,
            title: '',
            subTitle: '',
            link: '/'
        },
        {
            id: 2,
            image: banner2,
            title: '',
            subTitle: '',
            link: '/'
        },
        {
            id: 3,
            image: banner1,
            title: '',
            subTitle: '',
            link: '/'
        },
        {
            id: 4,
            image: banner2,
            title: '',
            subTitle: '',
            link: '/'
        },
        {
            id: 5,
            image: banner1,
            title: '',
            subTitle: '',
            link: '/'
        },
    ], [])


    // lấy sản phẩm theo danh mục (có tính khuyến mãi xử lý backend )
    const { data: categories } = useQuery({
        queryKey: ['categories-home'],
        queryFn: () => ProductCatalogueService.categoryHome()
    })

    const categoryHome = useMemo(() => {
        return categories?.data as unknown as IProductCatalogueHome[]
    }, [categories])


    // lấy ra danh mục bài viết
    const { data: postCategories } = useQuery({
        queryKey: ['categories-post-home'],
        queryFn: () => PostCatalogueService.categoryPostHome()
    })

    const categoriesPostHome = useMemo(() => {
        return postCategories?.data as unknown as IPostCatalogue[]
    }, [postCategories])

    // useEffect(() => {
    //     console.log(categoriesPostHome);
    // }, [categoriesPostHome])

    return (
        <>
            <div id="homePage">
                <HomeSlide />
                <HomeCategory data={categoryHome} />
                <div className="panel-banner mb-[30px]">
                    <div className="container">
                        <div className="grid grid-cols-5 gap-4" >
                            {banerData.map((banner) => (
                                <div className="col-span-1" key={banner.id}>
                                    <BannerItem image={banner.image}>
                                        {/* <div className="bagge py-[8px] px-[15px] bg-[#629D23] text-while font-bold mb-[20px] text-center rounded-[5px] w-[80%]">
                                            Weekend Discount
                                        </div> */}
                                        <h2 className="font-bold text-[26px] leading-[28px] mb-[10px] text-[#000]">{banner.title}</h2>
                                        <div className="sub-heading text-[26px] text-[#629d23] font-light">
                                            {banner.subTitle}
                                        </div>
                                    </BannerItem>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <HomePost data={categoriesPostHome} />
            </div>
        </>
    )
}


export default Home