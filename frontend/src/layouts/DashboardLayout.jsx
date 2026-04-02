import { Link, Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useAuthStore } from '../store/auth'

export default function DashboardLayout() {
	const { user } = useAuthStore()
	const role = user?.role
	
	const getRoleColors = () => {
		switch(role) {
			case 'student':
				return {
					bg: 'bg-blue-50',
					sidebar: 'bg-blue-600',
					accent: 'bg-blue-500',
					text: 'text-blue-600',
					hover: 'hover:bg-blue-100'
				}
			case 'staff':
				return {
					bg: 'bg-green-50',
					sidebar: 'bg-green-600',
					accent: 'bg-green-500',
					text: 'text-green-600',
					hover: 'hover:bg-green-100'
				}
			case 'admin':
				return {
					bg: 'bg-purple-50',
					sidebar: 'bg-purple-600',
					accent: 'bg-purple-500',
					text: 'text-purple-600',
					hover: 'hover:bg-purple-100'
				}
			default:
				return {
					bg: 'bg-gray-50',
					sidebar: 'bg-gray-600',
					accent: 'bg-gray-500',
					text: 'text-gray-600',
					hover: 'hover:bg-gray-100'
				}
		}
	}
	
	const colors = getRoleColors()
	
	return (
		<div className={`min-h-screen ${colors.bg} flex flex-col`}>
			<Navbar />
			<div className="flex flex-1">
				<aside className={`w-64 ${colors.sidebar} shadow-lg flex-shrink-0`}>
					<div className="p-6 h-full">
						<div className="mb-6">
							<h2 className="text-white text-lg font-bold capitalize">{role} Dashboard</h2>
							<p className="text-blue-100 text-sm">Welcome back, {user?.username}</p>
						</div>
						
						{role === 'student' && (
							<div className="space-y-2">
								<Link className="flex items-center text-white hover:bg-blue-500 px-3 py-2 rounded-lg transition-colors" to="/student/menu">
									<span className="mr-3">🍽️</span> Menu
								</Link>
								<Link className="flex items-center text-white hover:bg-blue-500 px-3 py-2 rounded-lg transition-colors" to="/student/cart">
									<span className="mr-3">🛒</span> Cart
								</Link>
								<Link className="flex items-center text-white hover:bg-blue-500 px-3 py-2 rounded-lg transition-colors" to="/student/orders">
									<span className="mr-3">📋</span> My Orders
								</Link>
								<Link className="flex items-center text-white hover:bg-blue-500 px-3 py-2 rounded-lg transition-colors" to="/student/feedback">
									<span className="mr-3">💬</span> Feedback
								</Link>
								<Link className="flex items-center text-white hover:bg-blue-500 px-3 py-2 rounded-lg transition-colors" to="/student/announcements">
									<span className="mr-3">📢</span> Announcements
								</Link>
							</div>
						)}
						
						{role === 'staff' && (
							<div className="space-y-2">
								<Link className="flex items-center text-white hover:bg-green-500 px-3 py-2 rounded-lg transition-colors" to="/staff/orders">
									<span className="mr-3">📦</span> Orders
								</Link>
								<Link className="flex items-center text-white hover:bg-green-500 px-3 py-2 rounded-lg transition-colors" to="/staff/availability">
									<span className="mr-3">⚙️</span> Menu Availability
								</Link>
								<Link className="flex items-center text-white hover:bg-green-500 px-3 py-2 rounded-lg transition-colors" to="/staff/feedback">
									<span className="mr-3">👁️</span> View Feedback
								</Link>
								<Link className="flex items-center text-white hover:bg-green-500 px-3 py-2 rounded-lg transition-colors" to="/staff/announcements">
									<span className="mr-3">📝</span> Create Announcement
								</Link>
							</div>
						)}
						
						{role === 'admin' && (
							<div className="space-y-2">
								<Link className="flex items-center text-white hover:bg-purple-500 px-3 py-2 rounded-lg transition-colors" to="/admin/menu">
									<span className="mr-3">🍕</span> Menu Management
								</Link>
								<Link className="flex items-center text-white hover:bg-purple-500 px-3 py-2 rounded-lg transition-colors" to="/admin/users">
									<span className="mr-3">👥</span> User Management
								</Link>
								<Link className="flex items-center text-white hover:bg-purple-500 px-3 py-2 rounded-lg transition-colors" to="/admin/analytics">
									<span className="mr-3">📊</span> Analytics
								</Link>
								<Link className="flex items-center text-white hover:bg-purple-500 px-3 py-2 rounded-lg transition-colors" to="/admin/feedback">
									<span className="mr-3">💬</span> Feedback Management
								</Link>
							</div>
						)}
					</div>
				</aside>
				<main className="flex-1 p-6 overflow-auto">
					<Outlet />
				</main>
			</div>
		</div>
	)
}
