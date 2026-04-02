import api from '../../api/client'

export default function CreateAnnouncement() {
	async function onSubmit(e) {
		e.preventDefault()
		const form = new FormData(e.currentTarget)
		try {
			await api.post('/announcements', { title: form.get('title'), content: form.get('content') })
			alert('Announcement posted')
			e.currentTarget.reset()
		} catch (e) {
			alert(e?.response?.data?.message || 'Failed')
		}
	}
	return (
		<form onSubmit={onSubmit} className="max-w-md space-y-3">
			<input name="title" placeholder="Title" className="w-full border p-2 rounded" required />
			<textarea name="content" placeholder="Content" className="w-full border p-2 rounded" required />
			<button className="bg-green-600 text-white px-3 py-1 rounded">Post</button>
		</form>
	)
}
