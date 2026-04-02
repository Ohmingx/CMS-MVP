import { useEffect, useState } from 'react'
import api from '../../api/client'

export default function ViewFeedback() {
	const [feedbacks, setFeedbacks] = useState([])
	const [loading, setLoading] = useState(false)
	
	useEffect(() => { 
		loadFeedbacks()
	}, [])
	
	async function loadFeedbacks() {
		try {
			setLoading(true)
			const { data } = await api.get('/staff/feedback')
			setFeedbacks(data.feedbacks || [])
		} catch (e) {
			console.error('Failed to load feedbacks:', e)
			alert('Failed to load feedbacks')
		} finally {
			setLoading(false)
		}
	}
	
	const getRatingStars = (rating) => {
		return '⭐'.repeat(rating) + '☆'.repeat(5 - rating)
	}
	
	return (
		<div className="space-y-6">
			<div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200">
				<h2 className="text-2xl font-bold text-gray-800 mb-2">Customer Feedback</h2>
				<p className="text-gray-600">View feedback from students about their orders</p>
			</div>
			
			{loading ? (
				<div className="flex justify-center items-center h-32">
					<div className="text-gray-500">Loading feedback...</div>
				</div>
			) : feedbacks.length === 0 ? (
				<div className="text-center py-8 text-gray-500">
					<p>No feedback received yet.</p>
				</div>
			) : (
				<div className="space-y-4">
					{feedbacks.map((f) => (
						<div key={f._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
							<div className="flex items-start justify-between mb-4">
								<div className="flex-1">
									<div className="flex items-center space-x-3 mb-2">
										<h4 className="font-semibold text-gray-800">{f.studentName}</h4>
										<span className="text-sm text-gray-500">
											{new Date(f.createdAt).toLocaleDateString()}
										</span>
										{f.orderDetails && (
											<span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
												Order #{f.orderDetails.orderId.slice(-6)}
											</span>
										)}
									</div>
									<div className="mb-3">
										<span className="text-sm text-gray-600">Rating: </span>
										<span className="text-yellow-500">{getRatingStars(f.rating)}</span>
									</div>
								</div>
							</div>
							
							<div className="space-y-3">
								<div>
									<h5 className="font-medium text-gray-700 mb-1">Feedback:</h5>
									<p className="text-gray-600">{f.comment || f.feedbackText}</p>
								</div>
								
								{f.suggestions && (
									<div>
										<h5 className="font-medium text-gray-700 mb-1">Suggestions:</h5>
										<p className="text-gray-600">{f.suggestions}</p>
									</div>
								)}
								
								{f.orderDetails && (
									<div className="bg-gray-50 p-3 rounded">
										<h5 className="font-medium text-gray-700 mb-2">Order Details:</h5>
										<div className="text-sm text-gray-600">
											<p><strong>Total:</strong> ₹{f.orderDetails.totalPrice}</p>
											<p><strong>Items:</strong> {f.orderDetails.items.map(item => `${item.name} (${item.quantity})`).join(', ')}</p>
										</div>
									</div>
								)}
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	)
}
