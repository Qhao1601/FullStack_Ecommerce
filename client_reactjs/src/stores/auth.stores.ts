import type { ICustomer } from "@/interfaces/customer.interface";
import cartService from "@/services/products/cart.service";
import { cartStore } from "@/stores/card.store";
import { create, type StateCreator } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Định nghĩa kiểu cho AuthState
type AuthState = {
    accessToken: string | null;
    expiresAt: number | null;
    customer: ICustomer | null;
    isSuaAt: number;
    setAuth: (token: string, expiresAt: number, customer: ICustomer | null) => void;
    clearAuth: () => void;
    isAuthenticated: () => boolean;
};

// Tạo slice cho trạng thái auth
const createAuthSlice: StateCreator<AuthState, [], []> = (set, get) => ({
    accessToken: null,
    expiresAt: null,
    customer: null,
    isSuaAt: Date.now(),
    setAuth: async (token, expiresAt, customer) => {
        set({ accessToken: token, expiresAt, customer, isSuaAt: Date.now() })
        // xử lý đồng bộ giỏ hàng
        const { cartStore } = await import('@/stores/card.store')
        const useCartStore = cartStore.getState()
        if (useCartStore.items.length > 0) {
            // nếu chưa sync dữ liệu thì mới tiến hành đồng bộ
            console.log('bắt đầu merge thông tin cart của ng dùng')
            await useCartStore.mergeGuestCart()
        }
        else {
            console.log('Load thông tin cart từ serve')
            await useCartStore.loadCartFromServer()
        }
    },
    clearAuth: () => {
        set({ accessToken: null, expiresAt: null, customer: null }) // Thêm clearAuth để reset trạng thái
        import('@/stores/card.store').then(({ cartStore }) => {
            cartStore.getState().clearCart()
        })
    },
    isAuthenticated: () => {
        const { accessToken, expiresAt, isSuaAt } = get()
        if (!accessToken || !expiresAt || !isSuaAt) return false;
        const currentTime = Date.now()
        const expiryTime = isSuaAt + expiresAt * 1000;
        return currentTime < expiryTime;
    }
});

// Cấu hình tùy chọn lưu trữ persistent
const persistOptions = {
    name: 'customer-storage', // Tên lưu trữ
    storage: createJSONStorage(() => localStorage) // Sử dụng localStorage làm nơi lưu trữ
};

// Tạo store với middleware persist
export const AuthStore = create<AuthState>()(
    persist(createAuthSlice, persistOptions)
);
