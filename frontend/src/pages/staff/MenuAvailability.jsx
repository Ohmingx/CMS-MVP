import { useEffect, useState } from 'react'
import api from '../../api/client'

export default function MenuAvailability() {
	const [items, setItems] = useState([])
	const [loading, setLoading] = useState(false)
	
	async function fetchAll() {
		try {
			setLoading(true)
			const { data } = await api.get('/staff/menu/all')
			setItems(data.items || [])
		} catch (e) {
			console.error('Failed to fetch menu items:', e)
			alert('Failed to load menu items')
		} finally {
			setLoading(false)
		}
	}
	
	useEffect(() => { fetchAll() }, [])
	
	async function toggleAvailability(item) {
		try {
			await api.put(`/staff/menu/availability/${item._id}`)
			// Update the local state
			setItems(items.map(i => 
				i._id === item._id ? { ...i, isAvailable: !i.isAvailable } : i
			))
		} catch (e) {
			alert(e?.response?.data?.message || 'Failed to toggle availability')
		}
	}
	
	if (loading) {
		return (
			<div className="flex justify-center items-center h-64">
				<div className="text-lg text-gray-600">Loading menu items...</div>
			</div>
		)
	}
	
	return (
		<div className="space-y-6">
			<div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg border border-green-200">
				<h2 className="text-2xl font-bold text-gray-800 mb-2">Menu Availability Management</h2>
				<p className="text-gray-600">Toggle the availability of menu items for students</p>
			</div>
			
			<div className="grid gap-4">
				{items.length === 0 ? (
					<div className="text-center py-12 bg-white rounded-lg border border-gray-200">
						<p className="text-gray-500 text-lg">No menu items found</p>
						<p className="text-gray-400 text-sm mt-2">Admin needs to add menu items first</p>
					</div>
				) : (
					items.map(item => (
						<div key={item._id} className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
							<div className="flex items-center justify-between">
								<div className="flex-1">
									<h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
									<p className="text-gray-600 mt-1">{item.description}</p>
									<p className="text-green-600 font-semibold mt-2">₹{item.price}</p>
								</div>
								<div className="flex items-center space-x-4">
									<div className="flex items-center">
										<div className={`w-3 h-3 rounded-full mr-2 ${item.isAvailable ? 'bg-green-500' : 'bg-red-500'}`}></div>
										<span className={`font-medium ${item.isAvailable ? 'text-green-600' : 'text-red-600'}`}>
											{item.isAvailable ? 'Available' : 'Unavailable'}
										</span>
									</div>
									<button
										onClick={() => toggleAvailability(item)}
										className={`px-4 py-2 rounded-lg font-medium transition-colors ${
											item.isAvailable 
												? 'bg-red-100 text-red-700 hover:bg-red-200' 
												: 'bg-green-100 text-green-700 hover:bg-green-200'
										}`}
									>
										{item.isAvailable ? 'Make Unavailable' : 'Make Available'}
									</button>
								</div>
							</div>
						</div>
					))
				)}
			</div>
		</div>
	)
}
