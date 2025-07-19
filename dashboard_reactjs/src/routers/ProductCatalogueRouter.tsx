import { RouteObject } from "react-router-dom";

import ProductCataloguesSave from "@/pages/products/catalogue/Save";
import ProductCatalogueIndex from "@/pages/products/catalogue/Index";
import { PermissionGuard } from "@/Guards/permissionGuard";

export const ProductCataloguesRoute: RouteObject[] = [
    {
        path: 'product_catalogues',
        element: (
            <PermissionGuard permissionName="product_catalogues:index">
                <ProductCatalogueIndex />
            </PermissionGuard>
        )
    },
    {
        path: 'product_catalogues/create',
        element: (
            <PermissionGuard permissionName="product_catalogues:store">
                <ProductCataloguesSave />
            </PermissionGuard>
        )
    },
    {
        path: 'product_catalogues/edit/:id',
        element: (
            <PermissionGuard permissionName="product_catalogues:update">
                <ProductCataloguesSave />
            </PermissionGuard>
        )
    },
]