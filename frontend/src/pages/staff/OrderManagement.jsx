import { useEffect, useState } from 'react'
import api from '../../api/client'

export default function OrderManagement() {
	const [orders, setOrders] = useState([])
	const [loading, setLoading] = useState(true)
	async function fetchOrders() {
		try {
			const { data } = await api.get('/staff/orders')
			setOrders(data.orders)
		} finally { setLoading(false) }
	}
	async function updateStatus(id, status) {
		await api.put(`/staff/orders/status/${id}`, { status })
		fetchOrders()
	}
	useEffect(() => { fetchOrders() }, [])
	if (loading) return <p>Loading...</p>
	return (
		<div className="space-y-3">
			{orders.map((o) => (
				<div key={o._id} className="bg-white p-4 rounded shadow">
					<div className="flex items-center justify-between">
						<p className="font-medium">{o.studentId?.username}</p>
						<p className="text-sm">Status: <span className="font-semibold capitalize">{o.status}</span></p>
					</div>
					<p className="text-sm text-gray-600">{o.items.map(i => `${i.name} x${i.quantity}`).join(', ')}</p>
					<div className="flex gap-2 mt-2">
						{['placed','preparing','prepared','delivered'].map(s => (
							<button key={s} onClick={() => updateStatus(o._id, s)} className="bg-gray-800 text-white px-2 py-1 rounded text-sm">{s}</button>
						))}
					</div>
				</div>
			))}
			{orders.length === 0 && <p>No orders.</p>}
		</div>
	)
}
