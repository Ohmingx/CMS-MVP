import { useEffect, useState } from 'react'
import api from '../../api/client'

export default function FeedbackForm() {
	const [orders, setOrders] = useState([])
	const [selectedOrder, setSelectedOrder] = useState('')
	const [loading, setLoading] = useState(false)
	
	useEffect(() => {
		loadDeliveredOrders()
	}, [])
	
	async function loadDeliveredOrders() {
		try {
			const { data } = await api.get('/orders/my-orders')
			const deliveredOrders = data.orders.filter(order => order.status === 'delivered')
			setOrders(deliveredOrders)
		} catch (e) {
			console.error('Failed to load orders:', e)
		}
	}
	
	async function onSubmit(e) {
		e.preventDefault()
		if (!selectedOrder) {
			alert('Please select an order to provide feedback for')
			return
		}
		
		setLoading(true)
		const form = new FormData(e.currentTarget)
		const payload = { 
			orderId: selectedOrder,
			rating: Number(form.get('rating')), 
			comment: form.get('comment'),
			suggestions: form.get('suggestions') || ''
		}
		
		try {
			await api.post('/feedback', payload)
			alert('Thanks for your feedback!')
			e.currentTarget.reset()
			setSelectedOrder('')
			loadDeliveredOrders()
		} catch (e) {
			alert(e?.response?.data?.message || 'Failed to submit feedback')
		} finally {
			setLoading(false)
		}
	}
	
	async function generateInvoice(orderId) {
		try {
			const { data } = await api.get(`/invoice/${orderId}`)
			const invoice = data.invoice
			
			// Create a printable invoice
			const invoiceWindow = window.open('', '_blank')
			invoiceWindow.document.write(`
				<html>
					<head><title>Invoice - Order ${invoice.orderId.slice(-6)}</title></head>
					<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
						<h1 style="text-align: center; color: #333;">🍽️ Canteen Invoice</h1>
						<hr>
						<p><strong>Order ID:</strong> ${invoice.orderId.slice(-6)}</p>
						<p><strong>Student:</strong> ${invoice.studentName}</p>
						<p><strong>Date:</strong> ${new Date(invoice.createdAt).toLocaleDateString()}</p>
						<p><strong>Status:</strong> ${invoice.status}</p>
						<hr>
						<h3>Items Ordered:</h3>
						<table style="width: 100%; border-collapse: collapse;">
							<tr style="background-color: #f5f5f5;">
								<th style="border: 1px solid #ddd; padding: 8px;">Item</th>
								<th style="border: 1px solid #ddd; padding: 8px;">Quantity</th>
								<th style="border: 1px solid #ddd; padding: 8px;">Price</th>
								<th style="border: 1px solid #ddd; padding: 8px;">Total</th>
							</tr>
							${invoice.items.map(item => `
								<tr>
									<td style="border: 1px solid #ddd; padding: 8px;">${item.name}</td>
									<td style="border: 1px solid #ddd; padding: 8px;">${item.quantity}</td>
									<td style="border: 1px solid #ddd; padding: 8px;">₹${item.price}</td>
									<td style="border: 1px solid #ddd; padding: 8px;">₹${item.price * item.quantity}</td>
								</tr>
							`).join('')}
						</table>
						<hr>
						<h3 style="text-align: right;">Total Amount: ₹${invoice.totalPrice}</h3>
						<p style="text-align: center; color: #666; margin-top: 30px;">
							Thank you for your order!<br>
							Generated on: ${new Date(invoice.invoiceDate).toLocaleString()}
						</p>
					</body>
				</html>
			`)
			invoiceWindow.document.close()
			invoiceWindow.print()
		} catch (e) {
			alert('Failed to generate invoice: ' + (e?.response?.data?.message || 'Unknown error'))
		}
	}
	
	return (
		<div className="space-y-6">
			<div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
				<h2 className="text-2xl font-bold text-gray-800 mb-2">Order Feedback & Invoice</h2>
				<p className="text-gray-600">Provide feedback for delivered orders and generate invoices</p>
			</div>
			
			<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
				<h3 className="text-lg font-semibold text-gray-800 mb-4">Delivered Orders</h3>
				
				{orders.length === 0 ? (
					<div className="text-center py-8 text-gray-500">
						<p>No delivered orders found.</p>
						<p className="text-sm mt-2">Feedback can only be provided for delivered orders.</p>
					</div>
				) : (
					<div className="space-y-4 mb-6">
						{orders.map(order => (
							<div key={order._id} className="border border-gray-200 rounded-lg p-4">
								<div className="flex items-center justify-between">
									<div>
										<h4 className="font-semibold text-gray-800">Order #{order._id.slice(-6)}</h4>
										<p className="text-sm text-gray-600">
											{order.items.length} items • ₹{order.totalPrice} • 
											{new Date(order.createdAt).toLocaleDateString()}
										</p>
									</div>
									<div className="flex gap-2">
										<button
											onClick={() => generateInvoice(order._id)}
											className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors"
										>
											📄 Generate Invoice
										</button>
									</div>
								</div>
							</div>
						))}
					</div>
				)}
				
				<form onSubmit={onSubmit} className="space-y-4">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">Select Order for Feedback</label>
						<select 
							value={selectedOrder} 
							onChange={e => setSelectedOrder(e.target.value)}
							className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							required
						>
							<option value="">Choose an order...</option>
							{orders.map(order => (
								<option key={order._id} value={order._id}>
									Order #{order._id.slice(-6)} - ₹{order.totalPrice} ({order.items.length} items)
								</option>
							))}
						</select>
					</div>
					
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
						<select 
							name="rating" 
							className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
							defaultValue="5"
							required
						>
							<option value="1">⭐ (1 - Poor)</option>
							<option value="2">⭐⭐ (2 - Fair)</option>
							<option value="3">⭐⭐⭐ (3 - Good)</option>
							<option value="4">⭐⭐⭐⭐ (4 - Very Good)</option>
							<option value="5">⭐⭐⭐⭐⭐ (5 - Excellent)</option>
						</select>
					</div>
					
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">Your Feedback</label>
						<textarea 
							name="comment" 
							placeholder="Tell us about your experience with this order..." 
							className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24" 
							required 
						/>
					</div>
					
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">Suggestions (Optional)</label>
						<textarea 
							name="suggestions" 
							placeholder="Any suggestions for improvement..." 
							className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-20" 
						/>
					</div>
					
					<button 
						disabled={loading || !selectedOrder}
						className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
					>
						{loading ? 'Submitting...' : 'Submit Feedback'}
					</button>
				</form>
			</div>
		</div>
	)
}
