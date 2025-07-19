import { RouteObject } from "react-router-dom";

import AttributeIndex from "@/pages/attributes/attribute/Index";
import AttributeSave from "@/pages/attributes/attribute/Save";
import { PermissionGuard } from "@/Guards/permissionGuard";



export const AttributeRoute: RouteObject[] = [
    {
        path: 'attributes',
        element: (
            <PermissionGuard permissionName="attributes:index">
                <AttributeIndex />
            </PermissionGuard>
        )
    },
    {
        path: 'attributes/create',
        element: (
            <PermissionGuard permissionName="attributes:store">
                <AttributeSave />
            </PermissionGuard>
        )
    },
    {
        path: 'attributes/edit/:id',
        element: (
            <PermissionGuard permissionName="attributes:update">
                <AttributeSave />
            </PermissionGuard>
        )
    },

]