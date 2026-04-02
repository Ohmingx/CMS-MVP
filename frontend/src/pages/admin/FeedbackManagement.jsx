import { useEffect, useState } from 'react'
import api from '../../api/client'

export default function FeedbackManagement() {
	const [feedbacks, setFeedbacks] = useState([])
	const [announcements, setAnnouncements] = useState([])
	const [loading, setLoading] = useState(false)
	const [activeTab, setActiveTab] = useState('feedback')
	
	async function loadFeedbacks() {
		try {
			setLoading(true)
			const { data } = await api.get('/admin/feedback')
			setFeedbacks(data.feedbacks || [])
		} catch (e) {
			console.error('Failed to load feedbacks:', e)
			alert('Failed to load feedbacks')
		} finally {
			setLoading(false)
		}
	}
	
	async function loadAnnouncements() {
		try {
			setLoading(true)
			const { data } = await api.get('/admin/announcements')
			setAnnouncements(data.announcements || [])
		} catch (e) {
			console.error('Failed to load announcements:', e)
			alert('Failed to load announcements')
		} finally {
			setLoading(false)
		}
	}
	
	useEffect(() => {
		if (activeTab === 'feedback') {
			loadFeedbacks()
		} else {
			loadAnnouncements()
		}
	}, [activeTab])
	
	async function deleteFeedback(id) {
		if (!confirm('Are you sure you want to delete this feedback?')) return
		try {
			await api.delete(`/admin/feedback/${id}`)
			loadFeedbacks()
		} catch (e) {
			alert('Failed to delete feedback: ' + (e?.response?.data?.message || 'Unknown error'))
		}
	}
	
	async function deleteAnnouncement(id) {
		if (!confirm('Are you sure you want to delete this announcement?')) return
		try {
			await api.delete(`/admin/announcements/${id}`)
			loadAnnouncements()
		} catch (e) {
			alert('Failed to delete announcement: ' + (e?.response?.data?.message || 'Unknown error'))
		}
	}
	
	const getRatingStars = (rating) => {
		return '⭐'.repeat(rating) + '☆'.repeat(5 - rating)
	}
	
	return (
		<div className="space-y-6">
			<div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-200">
				<h2 className="text-2xl font-bold text-gray-800 mb-2">Feedback & Notices Management</h2>
				<p className="text-gray-600">Manage feedback and announcements from users</p>
			</div>
			
			<div className="bg-white rounded-lg shadow-sm border border-gray-200">
				<div className="border-b border-gray-200">
					<nav className="flex space-x-8 px-6">
						<button
							onClick={() => setActiveTab('feedback')}
							className={`py-4 px-1 border-b-2 font-medium text-sm ${
								activeTab === 'feedback'
									? 'border-purple-500 text-purple-600'
									: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
							}`}
						>
							💬 Feedback ({feedbacks.length})
						</button>
						<button
							onClick={() => setActiveTab('announcements')}
							className={`py-4 px-1 border-b-2 font-medium text-sm ${
								activeTab === 'announcements'
									? 'border-purple-500 text-purple-600'
									: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
							}`}
						>
							📢 Announcements ({announcements.length})
						</button>
					</nav>
				</div>
				
				<div className="p-6">
					{loading ? (
						<div className="flex justify-center items-center h-32">
							<div className="text-gray-500">Loading...</div>
						</div>
					) : activeTab === 'feedback' ? (
						<div className="space-y-4">
							{feedbacks.length === 0 ? (
								<div className="text-center py-8 text-gray-500">
									<p>No feedback found.</p>
								</div>
							) : (
								feedbacks.map(feedback => (
									<div key={feedback._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
										<div className="flex items-start justify-between">
											<div className="flex-1">
												<div className="flex items-center space-x-3 mb-2">
													<h4 className="font-semibold text-gray-800">{feedback.studentName || 'Anonymous'}</h4>
													<span className="text-sm text-gray-500">
														{new Date(feedback.createdAt).toLocaleDateString()}
													</span>
													{feedback.orderId && (
														<span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
															Order #{feedback.orderId.slice(-6)}
														</span>
													)}
												</div>
												<div className="mb-2">
													<span className="text-sm text-gray-600">Rating: </span>
													<span className="text-yellow-500">{getRatingStars(feedback.rating)}</span>
												</div>
												<p className="text-gray-700 mb-2">{feedback.comment}</p>
												{feedback.suggestions && (
													<div className="bg-gray-50 p-3 rounded">
														<p className="text-sm text-gray-600">
															<strong>Suggestions:</strong> {feedback.suggestions}
														</p>
													</div>
												)}
											</div>
											<button
												onClick={() => deleteFeedback(feedback._id)}
												className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors font-medium ml-4"
											>
												Delete
											</button>
										</div>
									</div>
								))
							)}
						</div>
					) : (
						<div className="space-y-4">
							{announcements.length === 0 ? (
								<div className="text-center py-8 text-gray-500">
									<p>No announcements found.</p>
								</div>
							) : (
								announcements.map(announcement => (
									<div key={announcement._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
										<div className="flex items-start justify-between">
											<div className="flex-1">
												<h4 className="font-semibold text-gray-800 mb-2">{announcement.title}</h4>
												<p className="text-gray-700 mb-2">{announcement.content}</p>
												<div className="flex items-center space-x-3 text-sm text-gray-500">
													<span>By: {announcement.authorName || 'Staff'}</span>
													<span>•</span>
													<span>{new Date(announcement.createdAt).toLocaleDateString()}</span>
												</div>
											</div>
											<button
												onClick={() => deleteAnnouncement(announcement._id)}
												className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors font-medium ml-4"
											>
												Delete
											</button>
										</div>
									</div>
								))
							)}
						</div>
					)}
				</div>
			</div>
		</div>
	)
}
