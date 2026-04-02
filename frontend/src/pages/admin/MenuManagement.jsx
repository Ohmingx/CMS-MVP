import { useEffect, useState } from 'react'
import api from '../../api/client'

export default function MenuManagement() {
	const [items, setItems] = useState([])
	const [form, setForm] = useState({ name: '', price: '', description: '' })
	const [loading, setLoading] = useState(false)
	const [editingItem, setEditingItem] = useState(null)
	
	async function load() {
		try {
			setLoading(true)
			const { data } = await api.get('/admin/menu')
			setItems(data.items || [])
		} catch (e) {
			console.error('Failed to load menu items:', e)
			alert('Failed to load menu items: ' + (e?.response?.data?.message || 'Unknown error'))
		} finally {
			setLoading(false)
		}
	}
	
	useEffect(() => { load() }, [])
	
	async function createItem(e) {
		e.preventDefault()
		try {
			setLoading(true)
			const payload = { name: form.name, price: Number(form.price), description: form.description }
			const { data } = await api.post('/admin/menu', payload)
			alert('Created: ' + data.item.name)
			setForm({ name: '', price: '', description: '' })
			load()
		} catch (e) {
			alert('Failed to create item: ' + (e?.response?.data?.message || 'Unknown error'))
		} finally {
			setLoading(false)
		}
	}
	
	async function updateItem(item) {
		try {
			setLoading(true)
			await api.put(`/admin/menu/${item._id}`, item)
			alert('Updated: ' + item.name)
			setEditingItem(null)
			load()
		} catch (e) {
			alert('Failed to update item: ' + (e?.response?.data?.message || 'Unknown error'))
		} finally {
			setLoading(false)
		}
	}
	
	async function deleteItem(id, name) {
		if (!confirm(`Are you sure you want to delete "${name}"?`)) return
		try {
			setLoading(true)
			await api.delete(`/admin/menu/${id}`)
			alert('Deleted: ' + name)
			load()
		} catch (e) {
			alert('Failed to delete item: ' + (e?.response?.data?.message || 'Unknown error'))
		} finally {
			setLoading(false)
		}
	}
	
	return (
		<div className="space-y-6">
			<div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-200">
				<h2 className="text-2xl font-bold text-gray-800 mb-2">Menu Management</h2>
				<p className="text-gray-600">Add, edit, and manage menu items for the canteen</p>
			</div>
			
			<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
				<h3 className="text-lg font-semibold text-gray-800 mb-4">Add New Menu Item</h3>
				<form onSubmit={createItem} className="grid grid-cols-1 md:grid-cols-4 gap-4">
					<input 
						value={form.name} 
						onChange={e=>setForm({...form, name:e.target.value})} 
						placeholder="Item Name" 
						className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" 
						required 
					/>
					<input 
						value={form.price} 
						onChange={e=>setForm({...form, price:e.target.value})} 
						placeholder="Price (₹)" 
						type="number" 
						step="0.01"
						className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" 
						required 
					/>
					<input 
						value={form.description} 
						onChange={e=>setForm({...form, description:e.target.value})} 
						placeholder="Description" 
						className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" 
					/>
					<button 
						disabled={loading}
						className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
					>
						{loading ? 'Adding...' : 'Add Item'}
					</button>
				</form>
			</div>
			
			<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
				<h3 className="text-lg font-semibold text-gray-800 mb-4">Menu Items ({items.length})</h3>
				
				{loading ? (
					<div className="flex justify-center items-center h-32">
						<div className="text-gray-500">Loading menu items...</div>
					</div>
				) : items.length === 0 ? (
					<div className="text-center py-8 text-gray-500">
						<p>No menu items found. Add your first item above!</p>
					</div>
				) : (
					<div className="grid gap-4">
						{items.map(item => (
							<div key={item._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
								{editingItem?._id === item._id ? (
									<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
										<input 
											value={editingItem.name}
											onChange={e => setEditingItem({...editingItem, name: e.target.value})}
											className="border border-gray-300 p-2 rounded"
										/>
										<input 
											value={editingItem.price}
											onChange={e => setEditingItem({...editingItem, price: e.target.value})}
											type="number"
											step="0.01"
											className="border border-gray-300 p-2 rounded"
										/>
										<input 
											value={editingItem.description || ''}
											onChange={e => setEditingItem({...editingItem, description: e.target.value})}
											className="border border-gray-300 p-2 rounded"
										/>
										<div className="flex gap-2">
											<button 
												onClick={() => updateItem(editingItem)}
												className="bg-green-600 text-white px-3 py-1 rounded text-sm"
											>
												Save
											</button>
											<button 
												onClick={() => setEditingItem(null)}
												className="bg-gray-600 text-white px-3 py-1 rounded text-sm"
											>
												Cancel
											</button>
										</div>
									</div>
								) : (
									<div className="flex items-center justify-between">
										<div className="flex-1">
											<div className="flex items-center gap-3">
												<h4 className="font-semibold text-gray-800">{item.name}</h4>
												<div className={`px-2 py-1 rounded-full text-xs font-medium ${
													item.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
												}`}>
													{item.isAvailable ? 'Available' : 'Unavailable'}
												</div>
											</div>
											<p className="text-gray-600 text-sm mt-1">{item.description}</p>
											<p className="text-green-600 font-semibold mt-1">₹{item.price}</p>
										</div>
										<div className="flex gap-2">
											<button 
												onClick={() => setEditingItem({...item})}
												className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors"
											>
												Edit
											</button>
											<button 
												onClick={() => deleteItem(item._id, item.name)}
												className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
											>
												Delete
											</button>
										</div>
									</div>
								)}
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	)
}
