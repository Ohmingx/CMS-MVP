import { useEffect, useState } from 'react'
import api from '../../api/client'

export default function UserManagement() {
	const [users, setUsers] = useState([])
	const [loading, setLoading] = useState(false)
	
	async function load() { 
		try {
			setLoading(true)
			const { data } = await api.get('/admin/users'); 
			setUsers(data.users) 
		} catch (e) {
			console.error('Failed to load users:', e)
			alert('Failed to load users')
		} finally {
			setLoading(false)
		}
	}
	
	async function removeUser(id, username) { 
		if (!confirm(`Are you sure you want to delete user "${username}"?`)) return
		try {
			await api.delete(`/admin/users/${id}`); 
			load() 
		} catch (e) {
			alert('Failed to delete user: ' + (e?.response?.data?.message || 'Unknown error'))
		}
	}
	
	useEffect(() => { load() }, [])
	
	const getRoleColor = (role) => {
		switch(role) {
			case 'admin': return 'bg-purple-100 text-purple-800'
			case 'staff': return 'bg-green-100 text-green-800'
			case 'student': return 'bg-blue-100 text-blue-800'
			default: return 'bg-gray-100 text-gray-800'
		}
	}
	
	const getRoleIcon = (role) => {
		switch(role) {
			case 'admin': return '👑'
			case 'staff': return '👨‍🍳'
			case 'student': return '🎓'
			default: return '👤'
		}
	}
	
	return (
		<div className="space-y-6">
			<div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-200">
				<h2 className="text-2xl font-bold text-gray-800 mb-2">User Management</h2>
				<p className="text-gray-600">Manage all users in the system</p>
			</div>
			
			<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
				<div className="flex items-center justify-between mb-6">
					<h3 className="text-lg font-semibold text-gray-800">All Users ({users.length})</h3>
					<button 
						onClick={load}
						className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
					>
						Refresh
					</button>
				</div>
				
				{loading ? (
					<div className="flex justify-center items-center h-32">
						<div className="text-gray-500">Loading users...</div>
					</div>
				) : users.length === 0 ? (
					<div className="text-center py-8 text-gray-500">
						<p>No users found.</p>
					</div>
				) : (
					<div className="grid gap-4">
						{users.map(u => (
							<div key={u._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
								<div className="flex items-center justify-between">
									<div className="flex items-center space-x-4">
										<div className="text-2xl">{getRoleIcon(u.role)}</div>
										<div>
											<h4 className="font-semibold text-gray-800">{u.username}</h4>
											<div className="flex items-center space-x-2 mt-1">
												<span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(u.role)}`}>
													{u.role}
												</span>
												<span className="text-gray-500 text-sm">
													Joined: {new Date(u.createdAt).toLocaleDateString()}
												</span>
											</div>
										</div>
									</div>
									<div className="flex items-center space-x-2">
										{u.role !== 'admin' && (
											<button 
												onClick={() => removeUser(u._id, u.username)} 
												className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors font-medium"
											>
												Delete
											</button>
										)}
										{u.role === 'admin' && (
											<span className="text-gray-400 text-sm italic">Protected</span>
										)}
									</div>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	)
}
