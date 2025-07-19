import { RouteObject } from "react-router-dom";

import AttributeCatalogueIndex from "@/pages/attributes/attributeCatalogues/Index";
import AttributeCatalogueSave from "@/pages/attributes/attributeCatalogues/Save";
import { PermissionGuard } from "@/Guards/permissionGuard";



export const AttributeCatalogueRoute: RouteObject[] = [
    {
        path: 'attribute_catalogues',
        element: (
            <PermissionGuard permissionName="attribute_catalogues:index">
                <AttributeCatalogueIndex />
            </PermissionGuard>
        )
    },
    {
        path: 'attribute_catalogues/create',
        element: (
            <PermissionGuard permissionName="attribute_catalogues:store">
                <AttributeCatalogueSave />
            </PermissionGuard>
        )
    },
    {
        path: 'attribute_catalogues/edit/:id',
        element: (
            <PermissionGuard permissionName="attribute_catalogues:update">
                <AttributeCatalogueSave />
            </PermissionGuard>
        )
    },

]