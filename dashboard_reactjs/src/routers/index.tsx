import { createBrowserRouter, RouteObject } from "react-router-dom";
import Login from "../pages/auth/login";
import Dashboard from "@/pages/dashboard/Dashboard";
import { RequiredAuth, NoRequiredAuth } from "@/Guards/authGuard";
import Layout from "@/pages/dashboard/Layout";
import { useRoute } from "./useRoutes";
import { permissionRoute } from "./PermissionRouter"
import { PostCataloguesRoute } from "./PostCatalogueRouter";
import { PostsRoute } from "./PostsRouter";
import { AuthProvider } from "@/provider/AuthProvider";
import { brandRoute } from "./BrandsRouter";
import { ProductCataloguesRoute } from "./ProductCatalogueRouter";
import { ProductsRoute } from "./ProductsRouter";
import { SlidesRoute } from "./slidesRouter";
import { AttributeCatalogueRoute } from "./AttributeCatalogueRouter";
import { AttributeRoute } from "./AttributeRouter";
import { PromotionCatalogueRoute } from "./PromotionCatalogueRouter";
import { orderRoute } from "./OrderRouter";

const routes: RouteObject[] = [
    {
        path: '/admin',
        element: (
            <AuthProvider>
                <NoRequiredAuth>
                    <Login />
                </NoRequiredAuth>
            </AuthProvider>

        ),
    },
    {
        path: '/',
        element: (
            <AuthProvider>
                <RequiredAuth>
                    <Layout />
                </RequiredAuth>
            </AuthProvider>

        ),
        children: [
            {
                path: '/dashboard',
                element: <Dashboard />
            },
            ...useRoute,
            ...permissionRoute,
            ...PostCataloguesRoute,
            ...PostsRoute,
            ...brandRoute,
            ...ProductCataloguesRoute,
            ...ProductsRoute,
            ...SlidesRoute,
            ...AttributeCatalogueRoute,
            ...AttributeRoute,
            ...PromotionCatalogueRoute,
            ...orderRoute,

        ]
    }

]

const router = createBrowserRouter(routes)
export default router