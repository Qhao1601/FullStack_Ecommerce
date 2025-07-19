// import type { IPostCatalogue } from "@/interfaces/post/posts.interface"
// import { Clock, Folder, Plus } from "lucide-react"
// import { write_url, stripTags } from "@/utils/helper"

// interface IHomePost {
//     data: IPostCatalogue[] | undefined
// }

// const HomePost = ({ data }: IHomePost) => {
//     return (
//         <>
//             {data && data.length > 0 && data.map((item) => {
//                 const catName = item.name
//                 const catCanonical = write_url(item.canonical)
//                 return (
//                     <div key={item.id} className="panel-post mb-[30px]">
//                         <div className="container">
//                             <div className="panel-head mb-[30px]">
//                                 <h2 className="mb-[20px]">
//                                     <a href={catCanonical} className="uppercase text-[25] leading-[20px] font-bold">{catName}</a>
//                                 </h2>
//                             </div>
//                             {item.posts && item.posts.length > 0 && (
//                                 <div className="panel-body" >
//                                     <div className="grid grid-cols-4 gap-4">
//                                         {item.posts.map((item) => {
//                                             const name = item.name
//                                             const canonical = write_url(item.canonical)
//                                             const image = item.image
//                                             const createAt = item.creatAt
//                                             const description = stripTags(item.description)
//                                             return (
//                                                 <div className="col-span-1" key={item.id}>
//                                                     <div className="news-item border rounded-[10px]">
//                                                         <a href={canonical} title={name} className="block h-[190px]">
//                                                             <img src={image} alt={name} className="object-cover w-full h-full rounded-tr-[10px]" />
//                                                         </a>
//                                                         <div className="info py-[25px] px-[20px]">
//                                                             <div className="meta flex items-center">
//                                                                 <div className="flex items-center mr-[10px]">
//                                                                     <Clock size={12} className="mr-[5px]" />
//                                                                     <span className="time text-[12px]">{createAt}</span>
//                                                                 </div>
//                                                                 <div className="flex items-center">
//                                                                     <Folder size={12} />
//                                                                     <span className="time text-[12px]">{catName}</span>
//                                                                 </div>
//                                                             </div>
//                                                             <h3 className="title">
//                                                                 <a className="font-medium" href={canonical} title={name}>{name}</a>
//                                                             </h3>
//                                                             <div className="info">
//                                                                 <div className="description text-gray-00 mb-[3px] line-clamp-3">
//                                                                     {description}
//                                                                 </div>
//                                                             </div>
//                                                             <div className="readmore flex items-center">
//                                                                 <div className="leading-[26px] size-[30px] text-center rounded-[50%] bg-[#629d2326] mr-[10px]">
//                                                                     <Plus size={18} className="inline-block text-[#629d23] " />
//                                                                 </div>
//                                                                 <a href={canonical} className="font-medium hover:text-[#304a15]" title={name}>Xem chi tiết</a>
//                                                             </div>
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                             )
//                                         })}

//                                     </div>
//                                 </div>
//                             )}



//                         </div>

//                     </div>
//                 )
//             })}

//         </>
//     )
// }


// export default HomePost


import type { IPostCatalogue } from "@/interfaces/post/posts.interface";
import { write_url } from "@/utils/helper";
import PostItem from "./app-news-item";

interface IHomePost {
    data: IPostCatalogue[] | undefined;
}

const HomePost = ({ data }: IHomePost) => {
    return (
        <>
            {/*  dữ liệu data gồm nhóm bài viết và có cả bài viết */}
            {data && data.length > 0 && data.map((item) => {
                const catName = item.name;
                const catCanonical = write_url(item.canonical, item.id, 'artical_catalogue');
                return (
                    <div key={item.id} className="mb-8">
                        <div className="container mx-auto px-4">
                            <div className="mb-8">
                                <h2 className="text-2xl font-bold text-gray-900 uppercase tracking-wider mb-4">
                                    <a href={catCanonical} className="hover:text-[#629d23]">{catName}</a>
                                </h2>
                            </div>
                            {/*  lấy ra bài viết */}
                            {item.posts && item.posts.length > 0 && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                    {item.posts.map((post) => (
                                        <PostItem key={post.id} post={post} catName={catName} />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </>
    );
};

export default HomePost;
