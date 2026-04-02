import { useEffect, useState } from 'react'
import api from '../../api/client'
import { useCartStore } from '../../store/cart'

export default function MenuView() {
	const [items, setItems] = useState([])
	const [loading, setLoading] = useState(true)
	const addItem = useCartStore((s) => s.addItem)
	
	useEffect(() => {
		api.get('/menu').then(({ data }) => setItems(data.items)).finally(() => setLoading(false))
	}, [])
	
	if (loading) {
		return (
			<div className="flex justify-center items-center h-64">
				<div className="text-lg text-gray-600">Loading menu...</div>
			</div>
		)
	}
	
	return (
		<div className="space-y-6">
			<div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
				<h2 className="text-2xl font-bold text-gray-800 mb-2">Today's Menu</h2>
				<p className="text-gray-600">Choose from our delicious selection of items</p>
			</div>
			
			{items.length === 0 ? (
				<div className="text-center py-12 bg-white rounded-lg border border-gray-200">
					<div className="text-6xl mb-4">🍽️</div>
					<p className="text-gray-500 text-lg">No items available right now</p>
					<p className="text-gray-400 text-sm mt-2">Check back later or contact staff</p>
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{items.map((it) => (
						<div key={it._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
							<div className="text-center mb-4">
								<div className="text-4xl mb-2">🍕</div>
								<h3 className="text-lg font-semibold text-gray-800 mb-2">{it.name}</h3>
								<p className="text-green-600 font-bold text-xl">₹{it.price}</p>
							</div>
							
							{it.description && (
								<p className="text-gray-600 text-sm mb-4 text-center">{it.description}</p>
							)}
							
							<button 
								onClick={() => {
									addItem({ menuItemId: it._id, name: it.name, price: it.price, quantity: 1 })
									// Show a nice feedback
									const btn = event.target
									const originalText = btn.textContent
									btn.textContent = 'Added!'
									btn.className = 'w-full bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors'
									setTimeout(() => {
										btn.textContent = originalText
										btn.className = 'w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors'
									}, 1500)
								}} 
								className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
							>
								Add to Cart
							</button>
						</div>
					))}
				</div>
			)}
		</div>
	)
}
