import { create } from 'zustand'

type CartItemType = {
  id: number
  title: string
  heroImage: string
  price: number
  quantity: number
  maxQuantity: number
}

type CartState = {
  items: CartItemType[]
  addItem: (item: CartItemType) => void
  removeItem: (id: number) => void
  incrementItem: (id: number) => void
  decrementItem: (id: number) => void
  getTotalPrice: () => string
  getItemCount: () => number
  resetCart: () => void
}

const initialCartItems: CartItemType[] = []

export const useCartStore = create<CartState>((set, get) => ({
  items: initialCartItems,
  // 添加商品到购物车
  addItem: (item: CartItemType) => {
    const existingItem = get().items.find((i) => i.id === item.id)
    // 如果商品已经存在，则只增加数量
    if (existingItem) {
      set((state) => ({
        items: state.items.map((i) =>
          i.id === item.id
            ? {
                ...i,
                // 限制最大数量
                quantity: Math.min(i.quantity + item.quantity, i.maxQuantity),
              }
            : i
        ),
      }))
    } else {
      set((state) => ({ items: [...state.items, item] }))
    }
  },
  // 从购物车中移除商品
  removeItem: (id: number) =>
    set((state) => ({ items: state.items.filter((item) => item.id !== id) })),
  // 增加商品数量
  incrementItem: (id: number) =>
    set((state) => {
      return {
        items: state.items.map((item) =>
          item.id === id && item.quantity < item.maxQuantity
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ),
      }
    }),
  // 减少商品数量
  decrementItem: (id: number) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      ),
    })),
  // 获取总价格
  getTotalPrice: () => {
    const { items } = get()

    return items
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2)
  },
  // 获取商品数量
  getItemCount: () => {
    const { items } = get()
    return items.reduce((count, item) => count + item.quantity, 0)
  },
  // 重置购物车
  resetCart: () => set({ items: initialCartItems }),
}))
