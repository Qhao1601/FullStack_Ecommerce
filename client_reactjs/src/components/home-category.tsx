
// import type { IProductCatalogueHome } from "@/interfaces/products/product-catalogues.interface"
// import { write_url, formatPrice } from "@/utils/helper"
// import { Link } from "react-router"

// interface IHomeCategoryProps {
//     data: IProductCatalogueHome[]
// }
// const HomeCategory = ({ data }: IHomeCategoryProps) => {
//     return (
//         <>
//             {
//                 data && data.length > 0 && data.map((item) => {
//                     const canonical = write_url(item.canonical)
//                     const name = item.name
//                     return (
//                         <div className="panel-category py-[35px] mb-[30px]" key={item.id}>
//                             <div className="container">
//                                 <h2 className="mh-[20px]">
//                                     <Link className="uppercase text-[25px] leading-[28px] font-bold" to={`${canonical}`} >{name}</Link>
//                                 </h2>
//                                 <div className="grid grid-cols-7 gap-4 mt-[15px]">
//                                     {item.products && item.products.length > 0 && item.products.map((product) => {
//                                         const canonicalProduct = write_url(product.canonical)
//                                         const nameProduct = product.name
//                                         const image = product.image
//                                         const pricing = product.pricing
//                                         return (
//                                             <div className="col-span-1" key={product.id}>
//                                                 <div className="product-item border rounded-[5px] h-[330px]">
//                                                     <Link to={canonicalProduct} className="block h-[190px]">
//                                                         <img className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 rounded-tr-[5px]" src={image} alt={nameProduct} />
//                                                     </Link>
//                                                     <div className="info p-[10px]">
//                                                         <h3 className="mb-[8px] line-clamp-2">
//                                                             <Link to={canonicalProduct}>
//                                                                 {nameProduct}
//                                                             </Link>
//                                                         </h3>
//                                                         <div className="price-section">
//                                                             <div className="flex items-center gap-2 mb-[8px]">
//                                                                 <div className="finalPrice text-red-600 font-bold text-[16px]" >
//                                                                     {formatPrice(pricing.finalPrice.toString())}
//                                                                 </div>
//                                                                 {pricing.hasPromotion && (
//                                                                     <div className="discount-badge bg-red-500 text-white text-xs px-2 py-1 rounded">
//                                                                         -{pricing.discountPercent} %
//                                                                     </div>
//                                                                 )}
//                                                             </div>
//                                                             {pricing.hasPromotion && (
//                                                                 <div className="flex items-center gap-2">
//                                                                     <div className="origin-price text-gray-400 line-through text-sm">
//                                                                         {formatPrice(pricing.originalPrice.toString())}
//                                                                     </div>
//                                                                     <div className="save-amount text-green-500 text-xs">
//                                                                         Tiết kiệm {formatPrice(pricing.promotionDiscount.toString())}
//                                                                     </div>
//                                                                 </div>
//                                                             )}
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         )
//                                     })}

//                                 </div>
//                             </div>

//                         </div>
//                     )
//                 })
//             }
//         </>
//     )

// }


// export default HomeCategory


import type { IProductCatalogueHome } from "@/interfaces/products/product-catalogues.interface";
import { write_url } from "@/utils/helper";
import { Link } from "react-router";
import ProductItem from "./app-product";

interface IHomeCategoryProps {
    data: IProductCatalogueHome[];
}

const HomeCategory = ({ data }: IHomeCategoryProps) => {
    return (
        <>
            {/*  dữ liệu data gồm nhóm sản phâmr và có cả sản phâmr */}
            {
                data && data.length > 0 && data.map((item) => {
                    const canonical = write_url(item.canonical, item.id, 'product_catalogue');
                    const name = item.name;
                    return (
                        <div className="panel-category py-8 mb-8" key={item.id}>
                            <div className="container mx-auto px-4">
                                <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                                    <Link className="uppercase text-[26px] leading-[32px] font-bold hover:text-[#629d23]"
                                        to={`${canonical}`} >
                                        {name}

                                    </Link>
                                </h2>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-8 mt-6">
                                    {item.products && item.products.length > 0 && item.products.map((product) => (
                                        <ProductItem key={product.id} product={product} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    );
                })
            }
        </>
    );
};

export default HomeCategory;
