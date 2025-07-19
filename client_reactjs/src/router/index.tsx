import { createBrowserRouter, type RouteObject } from "react-router";

import Layout from "../pages/Layout";
import Home from "../pages/home/Home";
import ProductCatalogue from "@/pages/products/product_catalogue";
import PostCatalogue from "@/pages/posts/post-catalogues";
import Posts from "@/pages/posts/post";
import Products from "@/pages/products/product";
import CheckOut from "@/pages/cart/checkout";
import PaypalSuccess from "@/pages/cart/paypal.success";


const routes: RouteObject[] = [
    {
        path: '/',
        element: <Layout />,
        children: [
            {
                index: true,
                element: <Home />
            },
            {
                path: '/pc/:slug/:id.html',
                element: <ProductCatalogue />
            },
            {
                path: '/p/:slug/:id.html',
                element: <Products />
            },
            {
                path: '/ac/:slug/:id.html',
                element: <PostCatalogue />
            },
            {
                path: '/a/:slug/:id.html',
                element: < Posts />
            },
            {
                path: '/checkout',
                element: < CheckOut />
            },
            {
                path: '/paypal/success',
                element: < PaypalSuccess />
            }
        ],
    },

]

const router = createBrowserRouter(routes)
export default router