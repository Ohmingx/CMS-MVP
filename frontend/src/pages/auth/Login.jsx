import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/auth'

export default function LoginPage() {
	const { login, loading, error } = useAuthStore()
	const navigate = useNavigate()
	
	async function onSubmit(e) { 
		e.preventDefault(); 
		const f = new FormData(e.currentTarget); 
		const success = await login(f.get('username'), f.get('password'))
		if (success) {
			navigate('/')
		}
	}
	
	return (
		<div className="min-h-screen flex items-center justify-center p-4">
			<form onSubmit={onSubmit} className="w-full max-w-sm bg-white shadow p-6 rounded space-y-4">
				<h1 className="text-2xl font-semibold text-center">Canteen Login</h1>
				<input name="username" placeholder="VIT Email (e.g., john.doe@vit.edu.in)" className="w-full border p-2 rounded" required />
				<input name="password" type="password" placeholder="Password" className="w-full border p-2 rounded" required />
				{error && <p className="text-red-600 text-sm">{error}</p>}
				<button disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded">{loading ? 'Signing in...' : 'Login'}</button>
				<p className="text-sm text-center">No account? <Link to="/register" className="text-blue-600">Register</Link></p>
			</form>
		</div>
	)
}
