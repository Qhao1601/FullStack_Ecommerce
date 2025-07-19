import { RouteObject } from "react-router-dom";

import PromotionCatalogueSave from "@/pages/promotions/catalogue/Save";
import PromotionCatalogueIndex from "@/pages/promotions/catalogue/Index";

import PromotionsIndex from "@/pages/promotions/promotion/Index";

import PromotionsSave from "@/pages/promotions/promotion/Save";

import { PermissionGuard } from "@/Guards/permissionGuard";



export const PromotionCatalogueRoute: RouteObject[] = [
    {
        path: 'promotion_catalogues',
        element: (
            <PermissionGuard permissionName="promotion_catalogues:index">
                <PromotionCatalogueIndex />
            </PermissionGuard>
        )
    },
    {
        path: 'promotion_catalogues/create',
        element: (
            <PermissionGuard permissionName="promotion_catalogues:store">
                <PromotionCatalogueSave />
            </PermissionGuard>
        )
    },
    {
        path: 'promotion_catalogues/edit/:id',
        element: (
            <PermissionGuard permissionName="promotion_catalogues:update">
                <PromotionCatalogueSave />
            </PermissionGuard>
        )
    },


    {
        path: 'promotions',
        element: (
            <PermissionGuard permissionName="promotions:index">
                <PromotionsIndex />
            </PermissionGuard>
        )
    },
    {
        path: 'promotions/create',
        element: (
            <PermissionGuard permissionName="promotions:store">
                <PromotionsSave />
            </PermissionGuard>
        )
    },
    {
        path: 'promotions/edit/:id',
        element: (
            <PermissionGuard permissionName="promotions:update">
                <PromotionsSave />
            </PermissionGuard>
        )
    },

]