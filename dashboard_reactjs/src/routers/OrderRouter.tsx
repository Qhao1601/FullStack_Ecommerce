import { RouteObject } from "react-router-dom";
// import BrandSave from "@/pages/brands/Save";
import { PermissionGuard } from "@/Guards/permissionGuard";
import OrdersIndex from "@/pages/orders/Index";



export const orderRoute: RouteObject[] = [
    {
        path: 'orders',
        element: (
            <PermissionGuard permissionName="orders:index">
                <OrdersIndex />
            </PermissionGuard>
        )
    },
    // {
    //     path: 'brands/create',
    //     element: (
    //         <PermissionGuard permissionName="brands:store">
    //             <BrandSave />
    //         </PermissionGuard>
    //     )
    // },
    // {
    //     path: 'brands/edit/:id',
    //     element: (
    //         <PermissionGuard permissionName="brands:update">
    //             <BrandSave />
    //         </PermissionGuard>
    //     )
    // },

]