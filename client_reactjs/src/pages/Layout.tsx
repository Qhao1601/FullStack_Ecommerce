import Footer from "@/components/footer"
import Header from "@/components/header"
import { Outlet } from "react-router"
const Layout = () => {
    return (
        <>
            <Header />
            <Outlet />
            <Footer />
        </>
    )
}

export default Layout