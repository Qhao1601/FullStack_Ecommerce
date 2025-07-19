import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/stores";



// xử lý nếu chưa đăng nhập quay về admin
export const RequiredAuth = ({ children }: { children: React.ReactElement }) => {
    const auth = useSelector((state: RootState) => state.auth)
    const isAuthenticated = auth.isAuthenticated && !!auth.accessToken
    if (!isAuthenticated) {
        return <Navigate to="/admin" replace />
    }

    return children
}

export const NoRequiredAuth = ({ children }: { children: React.ReactElement }) => {

    const auth = useSelector((state: RootState) => state.auth)
    const isAuthenticated = auth.isAuthenticated && !!auth.accessToken
    const isTokenValid = auth.expiresAt ? auth.expiresAt > Date.now() : false

    if (isAuthenticated && isTokenValid) {
        return <Navigate to="/dashboard" replace />
    }
    return children;
}