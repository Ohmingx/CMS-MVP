import { Link } from 'react-router-dom'
import { useAuthStore } from '../store/auth'

export default function Navbar() {
	const { user, logout } = useAuthStore()
	
	const getRoleColor = () => {
		switch(user?.role) {
			case 'student': return 'text-blue-600 bg-blue-100'
			case 'staff': return 'text-green-600 bg-green-100'
			case 'admin': return 'text-purple-600 bg-purple-100'
			default: return 'text-gray-600 bg-gray-100'
		}
	}
	
	return (
		<nav className="w-full bg-white border-b shadow-sm px-6 py-4 flex items-center justify-between">
			<Link to="/" className="flex items-center space-x-2">
				<span className="text-2xl">🍽️</span>
				<span className="text-xl font-bold text-gray-800">Canteen Management</span>
			</Link>
			<div className="flex items-center gap-4">
				{user && (
					<div className="flex items-center space-x-3">
						<div className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleColor()}`}>
							{user.username} ({user.role})
						</div>
						<button 
							onClick={logout} 
							className="text-sm bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors font-medium"
						>
							Logout
						</button>
					</div>
				)}
			</div>
		</nav>
	)
}
