import { useEffect, useState } from 'react'
import api from '../../api/client'

export default function AnalyticsDashboard() {
	const [stats, setStats] = useState(null)
	useEffect(() => { api.get('/admin/analytics').then(({data}) => setStats(data)) }, [])
	if (!stats) return <p>Loading...</p>
	return (
		<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
			<div className="bg-white p-4 rounded shadow">
				<h3 className="text-sm text-gray-600">Daily Revenue</h3>
				<p className="text-2xl font-semibold">₹{stats.dailyRevenue}</p>
			</div>
			<div className="bg-white p-4 rounded shadow">
				<h3 className="text-sm text-gray-600">Today's Orders</h3>
				<p className="text-2xl font-semibold">{stats.todayOrders}</p>
			</div>
			<div className="bg-white p-4 rounded shadow">
				<h3 className="text-sm text-gray-600">Total Orders</h3>
				<p className="text-2xl font-semibold">{stats.totalOrders}</p>
			</div>
		</div>
	)
}
