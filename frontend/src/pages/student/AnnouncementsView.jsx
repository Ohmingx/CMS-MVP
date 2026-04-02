import { useEffect, useState } from 'react'
import api from '../../api/client'

export default function AnnouncementsView() {
	const [items, setItems] = useState([])
	useEffect(() => {
		api.get('/announcements').then(({ data }) => setItems(data.announcements))
	}, [])
	return (
		<div className="space-y-3">
			{items.map((a) => (
				<div key={a._id} className="bg-white p-4 rounded shadow">
					<h3 className="font-semibold">{a.title}</h3>
					<p className="text-sm text-gray-700">{a.content}</p>
					<p className="text-xs text-gray-500">By {a.authorId?.username} ({a.authorId?.role})</p>
				</div>
			))}
			{items.length === 0 && <p>No announcements.</p>}
		</div>
	)
}
