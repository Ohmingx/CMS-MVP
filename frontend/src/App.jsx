import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import { useAuthStore } from './store/auth'
import DashboardLayout from './layouts/DashboardLayout'
import { MenuView, CartView, MyOrders, FeedbackForm, AnnouncementsView } from './pages/student'
import { OrderManagement, MenuAvailability, ViewFeedback, CreateAnnouncement } from './pages/staff'
import { MenuManagement, UserManagement, AnalyticsDashboard, FeedbackManagement } from './pages/admin'

import Home from './pages/auth/Home'
import LoginPage from './pages/auth/Login'
import RegisterPage from './pages/auth/Register'

export default function App() {
	const init = useAuthStore((s) => s.init)
	useEffect(() => { init() }, [init])
	
	return (
		<Routes>
			<Route path="/" element={<Home />} />
			<Route path="/login" element={<LoginPage />} />
			<Route path="/register" element={<RegisterPage />} />

			<Route element={<ProtectedRoute roles={["student"]} />}>
				<Route element={<DashboardLayout />}> 
					<Route path="/student/menu" element={<MenuView />} />
					<Route path="/student/cart" element={<CartView />} />
					<Route path="/student/orders" element={<MyOrders />} />
					<Route path="/student/feedback" element={<FeedbackForm />} />
					<Route path="/student/announcements" element={<AnnouncementsView />} />
				</Route>
			</Route>

			<Route element={<ProtectedRoute roles={["staff"]} />}>
				<Route element={<DashboardLayout />}> 
					<Route path="/staff/orders" element={<OrderManagement />} />
					<Route path="/staff/availability" element={<MenuAvailability />} />
					<Route path="/staff/feedback" element={<ViewFeedback />} />
					<Route path="/staff/announcements" element={<CreateAnnouncement />} />
				</Route>
			</Route>

			<Route element={<ProtectedRoute roles={["admin"]} />}>
				<Route element={<DashboardLayout />}> 
					<Route path="/admin/menu" element={<MenuManagement />} />
					<Route path="/admin/users" element={<UserManagement />} />
					<Route path="/admin/analytics" element={<AnalyticsDashboard />} />
					<Route path="/admin/feedback" element={<FeedbackManagement />} />
				</Route>
			</Route>

			<Route path="*" element={<Navigate to="/" replace />} />
		</Routes>
	)
}
