import { publicApi } from "@/config/axios";
import { baseService } from "../base.Service";
import type { IApiOk } from "@/interfaces/api.interface";
import type { IPostCatalogue } from "@/interfaces/post/posts.interface";

const ENDPOINT = 'v1/public/post_catalogues'
const PostCatalogueService = {
    ...baseService,
    categoryPostHome: async (): Promise<IApiOk<IPostCatalogue[]>> => {
        const response = await publicApi.get(`${ENDPOINT}/get_post_home`)
        return response.data
    }
}

export default PostCatalogueService