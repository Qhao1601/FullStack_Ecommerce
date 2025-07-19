import { RouteObject } from "react-router-dom";

import SlidesIndex from "@/pages/slides/Index";
import SlidesSave from "@/pages/slides/Save";
import { PermissionGuard } from "@/Guards/permissionGuard";

export const SlidesRoute: RouteObject[] = [
    {
        path: 'slides',
        element: (
            <PermissionGuard permissionName="slides:index">
                <SlidesIndex />
            </PermissionGuard>
        )
    },
    {
        path: 'slides/create',
        element: (
            <PermissionGuard permissionName="slides:store">
                <SlidesSave />
            </PermissionGuard>
        )
    },
    {
        path: 'slides/edit/:id',
        element: (
            <PermissionGuard permissionName="slides:update">
                <SlidesSave />
            </PermissionGuard>
        )
    },

]