import { RouteObject } from "react-router-dom";

import ProductsSave from "@/pages/products/product/Save";
import ProductsIndex from "@/pages/products/product/Index";
import { PermissionGuard } from "@/Guards/permissionGuard";

export const ProductsRoute: RouteObject[] = [
    {
        path: 'products',
        element: (
            <PermissionGuard permissionName="products:index">
                <ProductsIndex />
            </PermissionGuard>
        )
    },
    {
        path: 'products/create',
        element: (
            <PermissionGuard permissionName="products:store">
                <ProductsSave />
            </PermissionGuard>
        )
    },
    {
        path: 'products/edit/:id',
        element: (
            <PermissionGuard permissionName="products:update">
                <ProductsSave />
            </PermissionGuard>
        )
    },

]