import { useCartStore } from '../../store/cart'
import api from '../../api/client'
import { useState } from 'react'

export default function CartView() {
	const { items, removeItem, clear, totalPrice } = useCartStore()
	const [loading, setLoading] = useState(false)
	async function placeOrder() {
		if (items.length === 0) return
		setLoading(true)
		try {
			await api.post('/orders', { items })
			clear()
			alert('Order placed!')
		} catch (e) {
			alert(e?.response?.data?.message || 'Failed to place order')
		} finally {
			setLoading(false)
		}
	}
	return (
		<div className="space-y-4">
			{items.length === 0 ? <p>Your cart is empty.</p> : (
				<div className="space-y-2">
					{items.map((it) => (
						<div key={it.menuItemId} className="flex items-center justify-between bg-white p-3 rounded shadow">
							<div>
								<p className="font-medium">{it.name}</p>
								<p className="text-sm text-gray-600">Qty: {it.quantity} • ₹{it.price}</p>
							</div>
							<button onClick={() => removeItem(it.menuItemId)} className="text-red-600">Remove</button>
						</div>
					))}
					<div className="flex items-center justify-between">
						<p className="font-semibold">Total: ₹{totalPrice()}</p>
						<button disabled={loading} onClick={placeOrder} className="bg-green-600 text-white px-3 py-1 rounded">{loading ? 'Placing...' : 'Place Order'}</button>
					</div>
				</div>
			)}
		</div>
	)
}
