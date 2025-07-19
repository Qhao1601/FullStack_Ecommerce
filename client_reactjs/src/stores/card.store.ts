import type { IProducts, IProductVariant } from '@/interfaces/products/products.interface';
import cartService from '@/services/products/cart.service';
import { create, type StateCreator } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';


export type TSelectedAttributes = {
    catalogueId: number,
    catalogueName: string,
    attributeId: number,
    attributeName: string
}


export interface ICartItem {
    id: string,
    productId: number,
    variantId?: number,
    productName: string,
    productImage: string,
    productCode: string,
    variantSku?: string,
    selectedAttributes?: TSelectedAttributes[],
    originalPrice: number,
    finalPrice: number,
    discount: number,
    quantity: number,
    totalPrice: number,
    createdAt: string
};

export interface ICartSummary {
    totalItems: number,
    toltalQuantity: Number,
    subTotal: number,
    totalDiscount: number,
    totalAmount: number
}


type ICartState = {
    items: ICartItem[],
    summary: ICartSummary,
    isLoading: boolean,
    isSyncing: boolean,
    isSynced: boolean,
    error: string | null,
    lastSyncAt: string,


    setSynced: (flag: boolean) => void

    //Core actions - Client side Only
    addItem: (product: IProducts, quantity: number, variant?: IProductVariant | null,) => void,
    removeItem: (itemId: string) => void,
    update: (itemId: string, quantity: number) => void,
    clearCart: () => void,
    summaryCart: () => void,

    //sync method
    syncWithService: () => Promise<boolean>
    loadCartFromServer: () => Promise<boolean>
    mergeGuestCart: () => Promise<boolean>
    //helper
    getItemById: (itemId: string) => ICartItem | undefined
}

const initiaSummary: ICartSummary = {
    totalItems: 0,
    toltalQuantity: 0,
    subTotal: 0,
    totalDiscount: 0,
    totalAmount: 0

}

// Tạo slice cho trạng thái auth
const createAuthSlice: StateCreator<ICartState, [], []> = (set, get) => ({
    items: [],
    summary: initiaSummary,
    isLoading: false,
    // TH true: khi giỏ hàng đang tiến hành đồng bộ với serve (vd đang gửi yêu cầu đồng bộ giỏ hàng)
    // TH false: khi giỏ hàng không còn trong qtrinh đồng bộ có thể hoàn thành hoặc thực hiện đồng bộ
    isSyncing: false,
    // TH true : đánh dấu đồng bộ thành công với server
    // TH false : khi giỏ hàng ch được đồng bộ thành công
    isSynced: false,
    error: null,
    // cập nhật thời gian cuồi cùng đồng bộ
    lastSyncAt: '',


    addItem: (product: IProducts, quantity: number, variant?: IProductVariant | null) => {
        const { items } = get()
        const itemId = variant ? `${product.id}_${variant.id}` : `${product.id}`
        const existingItemIndex = items.findIndex(item => item.id === itemId)
        if (existingItemIndex >= 0) {
            const existingItem = items[existingItemIndex]
            const newQuantity = existingItem.quantity + quantity
            const updatedItems = [...items]
            updatedItems[existingItemIndex] = {
                ...existingItem,
                quantity: newQuantity,
                totalPrice: existingItem.finalPrice * newQuantity,
            }
            set({ items: updatedItems, error: null })
        }
        else {
            const pricing = variant?.pricing || product.pricing
            // muốn thêm tiền bao nhiêu trước khi vào giỏ hàng thì cộng dô
            const price = pricing.finalPrice
            const originalPrice = pricing.originalPrice
            const discount = pricing.promotionDiscount || 0

            const newItem: ICartItem = {
                id: itemId,
                productId: product.id,
                variantId: variant?.id,
                productName: product.name,
                productImage: product.image,
                productCode: product.code ?? '',
                variantSku: variant?.sku,
                selectedAttributes: variant?.attributeNames?.map((name, index) => ({
                    catalogueId: 0,
                    catalogueName: '',
                    attributeId: variant.attributes?.[index] || 0,
                    attributeName: name
                })),
                originalPrice,
                finalPrice: price,
                discount: discount,
                quantity,
                totalPrice: price * quantity,
                createdAt: new Date().toISOString()
            }
            console.log(newItem)
            set({ items: [...items, newItem] })
        }
        get().summaryCart()
    },
    // summaryCart: () => {
    //     const { items } = get()
    //     const summary: ICartSummary = {
    //         // số lượng mặt hàng
    //         totalItems: items.length,
    //         toltalQuantity: items.reduce((sum, item) => sum + item.quantity, 0),
    //         subTotal: items.reduce((sum, item) => sum + (item.finalPrice * item.quantity), 0),
    //         totalDiscount: items.reduce((sum, item) => sum + (item.discount * item.quantity), 0),
    //         totalAmount: items.reduce((sum, item) => sum + item.totalPrice, 0)
    //     }
    //     set({ summary })
    // },
    // mới
    summaryCart: () => {
        const { items } = get();
        // Kiểm tra lại totalPrice cho từng item và log lại giá trị để xem chúng có hợp lệ không
        items.forEach(item => {
            if (isNaN(item.totalPrice) || item.totalPrice === undefined) {
                console.log("Item có totalPrice không hợp lệ:", item);
                item.totalPrice = item.finalPrice * item.quantity; // Gán lại totalPrice nếu không hợp lệ
            }
        });

        // Lọc các item có totalPrice hợp lệ (không phải NaN, null hoặc undefined)
        const validItems = items.filter(item => !isNaN(item.totalPrice) && item.totalPrice !== undefined);

        // Kiểm tra lại số lượng item sau khi lọc
        console.log("Số lượng item hợp lệ:", validItems.length);

        // Nếu không có item hợp lệ, sử dụng tất cả các item để tính toán
        if (validItems.length === 0) {
            validItems.push(...items); // Sử dụng tất cả các item nếu không có item hợp lệ
        }

        // validItems.forEach(item => {
        //     console.log("Item:", item);
        //     console.log("totalPrice:", item.totalPrice);
        //     console.log("finalPrice:", item.finalPrice);
        //     console.log("quantity:", item.quantity);
        // });

        // Tính toán tổng giỏ hàng chỉ với các item hợp lệ
        const summary: ICartSummary = {
            totalItems: validItems.length,
            toltalQuantity: validItems.reduce((sum, item) => sum + item.quantity, 0),
            subTotal: validItems.reduce((sum, item) => sum + (item.finalPrice * item.quantity), 0),
            totalDiscount: validItems.reduce((sum, item) => sum + (item.discount * item.quantity), 0),
            totalAmount: validItems.reduce((sum, item) => sum + item.totalPrice, 0),  // Tổng hợp cho các item hợp lệ
        };

        set({ summary });
    },


    removeItem: async (itemId: string) => {
        const { items } = get()
        const updateItems = items.filter(item => item.id !== itemId)
        set({ items: updateItems })
        get().summaryCart()
        try {
            await cartService.removeItem(itemId)
        } catch (error) {
            console.log(error, "đồng bộ số lượng ở thanh toán thất bại")
        }
    },
    update: async (itemId: string, quantity: number) => {
        const { items } = get()
        if (quantity <= 0) {
            get().removeItem(itemId)
            return
        }
        const updateItems = items.map(item => {
            if (item.id === itemId) {
                return {
                    ...item,
                    quantity,
                    totalPrice: item.finalPrice * quantity
                }
            }
            return item
        })

        try {
            await cartService.updateItem(itemId, { quantity: quantity })
        } catch (error) {
            console.log(error, "đồng bộ số lượng ở thanh toán thất bại")
        }

        set({ items: updateItems, error: null })
        get().summaryCart()
    },

    clearCart: () => {
        set({
            items: [],
            summary: initiaSummary,
            error: null

        })
    },

    getItemById: (itemId: string) => {
        const { items } = get();
        return items.find(item => item.id === itemId)
    },

    // đồng cả serve và client
    syncWithService: async () => {
        const { items, isSyncing } = get()
        if (isSyncing) {
            return false
        }
        try {
            set({ isSyncing: true, error: null })
            const response = await cartService.syncCart(items)
            console.log(response)
            if (response.status) {
                set({
                    lastSyncAt: new Date().toISOString(),
                    isSyncing: false
                })
                return true
            } else {
                throw new Error(response.message)
            }

        } catch (error) {
            console.error('Không để đồng bộ thông tin giỏ hàng', error)
            set({
                error: error instanceof Error ? error.message : 'Đồng bộ giỏ hàng thất bại',
                isSyncing: false
            })
            return false
        }
    },

    loadCartFromServer: async () => {
        try {
            const { AuthStore } = await import('@/stores/auth.stores')
            const { isAuthenticated } = AuthStore.getState()

            if (!isAuthenticated()) {
                console.log('khong co ng dung');
                return false
            }
            set({ isLoading: true })

            const response = await cartService.getCart()
            console.log(response.data.summary.totalAmount);
            if (!response.status) {

                throw new Error('Load failed')
            }
            const serviceItem: ICartItem[] = response.data.items

            set({ items: serviceItem, isLoading: false, isSynced: true })
            get().summaryCart();
            return true

        } catch (error) {
            console.error('Không thể load thông tin giỏ hàng của người dùng từ phía server', error)
            set({ error: 'Tải giỏ hàng thất bại', isLoading: false })
            return false
        }
    },
    mergeGuestCart: async () => {
        const { items: guestItems } = get()
        if (guestItems.length === 0) {
            return await get().loadCartFromServer()
        }
        try {
            const response = await cartService.syncCart(guestItems)

            if (!response.status) {
                throw new Error(response.message)
            }
            set({
                items: response.data.items,
                summary: response.data.summary,
                isSynced: true
            })
            get().summaryCart()
            return true

        } catch (error) {
            console.error('Đồng bộ giỏ hàng thất bại', error)
            set({ error: "Đồng bộ giỏ hàng thất bại" })
            return false
        }
        return true;
    },

    setSynced: (flag: boolean) => set({ isSynced: flag })

});

// Cấu hình tùy chọn lưu trữ persistent
const persistOptions = {
    name: 'cart-storage', // Tên lưu trữ
    storage: createJSONStorage(() => localStorage), // Sử dụng localStorage làm nơi lưu trữ
    partialize: (state: ICartState) => ({
        items: state.items,
        summary: state.summary,
        isSynced: state.isSynced
    })
};

// Tạo store với middleware persist
export const cartStore = create<ICartState>()(
    persist(createAuthSlice, persistOptions)
);
