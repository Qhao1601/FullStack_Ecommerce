import { createContext, ReactNode, useContext, useEffect, useRef } from "react"
import { useAppSelector } from "@/stores"
import { useRefesh } from "@/hooks/useRefesh"



interface IAuthContext {
    isAuthenticated: boolean,
    isTokenValid: boolean
}

interface IAuthProviderProps {
    children: ReactNode
}

const AuthContext = createContext<IAuthContext | null>(null)

export const AuthProvider = ({ children }: IAuthProviderProps) => {

    const auth = useAppSelector((state) => state.auth)
    const hasAttempRef = useRef<boolean>(false)
    const { refreshToken } = useRefesh()
    // xem trạng thái đăng nhập và có token k ? 
    const isAuthenticated = auth.isAuthenticated && !!auth.accessToken
    //Kiểm tra xem token có hợp lệ không. Nếu auth.expiresAt (thời gian hết hạn token) có giá trị, 
    // thì nó sẽ so sánh với thời gian hiện tại (Date.now()). Nếu token chưa hết hạn, isTokenValid sẽ là true.
    const isTokenValid = auth.expiresAt ? auth.expiresAt > Date.now() : false

    console.log(isAuthenticated, isTokenValid, auth.accessToken)

    useEffect(() => {
        if (isAuthenticated === true && isTokenValid === false && !hasAttempRef.current) {
            hasAttempRef.current = true
            refreshToken.mutate(undefined)
        }

        if (!isAuthenticated) {
            hasAttempRef.current = false
        }

    }, [isAuthenticated, isTokenValid, refreshToken])


    return (
        <AuthContext.Provider value={{ isAuthenticated, isTokenValid }}>
            {children}
        </AuthContext.Provider>
    )

}

export const useAuthContext = () => useContext(AuthContext)