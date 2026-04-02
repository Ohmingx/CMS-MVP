import { Link, Navigate } from 'react-router-dom'
import { useAuthStore } from '../../store/auth'

export default function Home() {
	const { user } = useAuthStore()
	
	if (user) {
		// If user is logged in, redirect to their dashboard
		if (user.role === 'student') {
			return <Navigate to="/student/menu" replace />
		} else if (user.role === 'staff') {
			return <Navigate to="/staff/orders" replace />
		} else if (user.role === 'admin') {
			return <Navigate to="/admin/menu" replace />
		}
	}
	
	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50">
			<div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
				<div className="text-center">
					<h1 className="text-3xl font-bold text-gray-900 mb-2">Canteen Management System</h1>
					<p className="text-gray-600 mb-8">Welcome to the canteen management system</p>
				</div>
				
				<div className="space-y-4">
					<div className="text-center">
						<p className="text-sm text-gray-600 mb-4">Choose your role to access the system:</p>
					</div>
					<div className="grid gap-4">
						<Link 
							to="/student/menu" 
							className="block w-full px-4 py-3 text-center bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
						>
							Student Portal
						</Link>
						<Link 
							to="/staff/orders" 
							className="block w-full px-4 py-3 text-center bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
						>
							Staff Portal
						</Link>
						<Link 
							to="/admin/menu" 
							className="block w-full px-4 py-3 text-center bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
						>
							Admin Portal
						</Link>
					</div>
					
					<div className="text-center pt-4 border-t">
						<p className="text-sm text-gray-600">
							Don't have an account? <Link to="/register" className="text-blue-600 hover:underline">Register here</Link>
						</p>
						<p className="text-sm text-gray-600 mt-2">
							Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Login here</Link>
						</p>
					</div>
				</div>
			</div>
		</div>
	)
}
