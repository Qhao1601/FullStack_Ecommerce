import { publicApi } from "@/config/axios";
import { baseService } from "../base.Service";
import type { IApiOk } from "@/interfaces/api.interface";
import type { IProductCatalogueHome } from "@/interfaces/products/product-catalogues.interface";


const ENDPOINT = 'v1/public/product_catalogues'
const ProductCatalogueService = {
    ...baseService,
    categoryHome: async (): Promise<IApiOk<IProductCatalogueHome[]>> => {
        const response = await publicApi.get(`${ENDPOINT}/get_category_home`)
        return response.data
    }
}

export default ProductCatalogueService