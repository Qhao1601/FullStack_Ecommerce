import { RouteObject } from "react-router-dom";

import BrandIndex from "@/pages/brands/Index";
import BrandSave from "@/pages/brands/Save";
import { PermissionGuard } from "@/Guards/permissionGuard";



export const brandRoute: RouteObject[] = [
    {
        path: 'brands',
        element: (
            <PermissionGuard permissionName="brands:index">
                <BrandIndex />
            </PermissionGuard>
        )
    },
    {
        path: 'brands/create',
        element: (
            <PermissionGuard permissionName="brands:store">
                <BrandSave />
            </PermissionGuard>
        )
    },
    {
        path: 'brands/edit/:id',
        element: (
            <PermissionGuard permissionName="brands:update">
                <BrandSave />
            </PermissionGuard>
        )
    },

]