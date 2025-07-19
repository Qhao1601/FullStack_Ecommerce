import type { IPosts } from "@/interfaces/post/posts.interface";
import { stripTags, write_url } from "@/utils/helper";
import { Clock, Folder, Plus } from "lucide-react";
import { memo } from "react";

interface IPostItemProps {
    post: IPosts
    catName: string
}

const PostItem = ({ post, catName }: IPostItemProps) => {

    // const { name, image, pricing } = product

    const name = post.name;
    const canonical = write_url(post.canonical, post.id, 'artical');
    const image = post.image;
    const createAt = post.creatAt;
    const description = stripTags(post.description);

    return (
        <>
            <div key={post.id} className="bg-white rounded-lg shadow-lg overflow-hidden group hover:shadow-2xl transition-shadow duration-300">
                <a href={canonical} className="block w-full h-56">
                    <img
                        src={image}
                        alt={name}
                        className="w-full h-full object-contain object-center group-hover:scale-105 transition-transform duration-300 max-w-full max-h-[250px]"
                    />
                </a>

                <div className="p-6">
                    <div className="flex items-center text-sm text-gray-500 space-x-4 mb-4">
                        <div className="flex items-center">
                            <Clock size={12} className="mr-2 text-gray-400" />
                            <span>{createAt}</span>
                        </div>
                        <div className="flex items-center">
                            <Folder size={12} className="mr-2 text-gray-400" />
                            <span>{catName}</span>
                        </div>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-800 hover:text-[#629d23]">
                        <a href={canonical}>{name}</a>
                    </h3>

                    <p className="text-gray-600 mt-2 mb-4 line-clamp-3">
                        {description}
                    </p>

                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-2">
                            <div className="bg-[#629d2326] text-[#629d23] p-2 rounded-full hover:bg-[#629d23] hover:text-white transition-all duration-300">
                                <Plus size={18} />
                            </div>
                            <a href={canonical} className="text-[#629d23] font-medium hover:text-[#304a15]">
                                Xem chi tiết
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}


export default memo(PostItem)