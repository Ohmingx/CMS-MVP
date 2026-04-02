import { useEffect, useState } from 'react'
import api from '../../api/client'

export default function MyOrders() {
	const [orders, setOrders] = useState([])
	const [loading, setLoading] = useState(true)
	async function fetchOrders() {
		try {
			const { data } = await api.get('/orders/my-orders')
			setOrders(data.orders)
		} finally {
			setLoading(false)
		}
	}
	useEffect(() => {
		fetchOrders()
		const id = setInterval(fetchOrders, 5000)
		return () => clearInterval(id)
	}, [])
	if (loading) return <p>Loading...</p>
	return (
		<div className="space-y-3">
			{orders.map((o) => (
				<div key={o._id} className="bg-white p-4 rounded shadow">
					<div className="flex items-center justify-between">
						<p className="font-medium">Order #{o._id.slice(-6)}</p>
						<span className="text-sm">Status: <span className="font-semibold capitalize">{o.status}</span></span>
					</div>
					<p className="text-sm text-gray-600">Items: {o.items.map(i => `${i.name} x${i.quantity}`).join(', ')}</p>
					<p className="text-sm">Total: ₹{o.totalPrice}</p>
				</div>
			))}
			{orders.length === 0 && <p>No orders yet.</p>}
		</div>
	)
}
