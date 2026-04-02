import { create } from 'zustand'

export const useCartStore = create((set, get) => ({
	items: [],
	addItem: (item) => {
		const existing = get().items.find((i) => i.menuItemId === item.menuItemId)
		if (existing) {
			set({ items: get().items.map((i) => i.menuItemId === item.menuItemId ? { ...i, quantity: i.quantity + item.quantity } : i) })
		} else {
			set({ items: [...get().items, item] })
		}
	},
	removeItem: (menuItemId) => set({ items: get().items.filter((i) => i.menuItemId !== menuItemId) }),
	clear: () => set({ items: [] }),
	totalPrice: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
}))
