import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/auth'

export default function RegisterPage() {
	const { register, loading, error } = useAuthStore()
	const navigate = useNavigate()
	
	async function onSubmit(e) { 
		e.preventDefault(); 
		const f = new FormData(e.currentTarget); 
		const success = await register(f.get('username'), f.get('password'), f.get('role'))
		if (success) {
			navigate('/')
		}
	}
	
	return (
		<div className="min-h-screen flex items-center justify-center p-4">
			<form onSubmit={onSubmit} className="w-full max-w-sm bg-white shadow p-6 rounded space-y-4">
				<h1 className="text-2xl font-semibold text-center">Register</h1>
				<input name="username" placeholder="VIT Email (e.g., john.doe@vit.edu.in)" className="w-full border p-2 rounded" required />
				<input name="password" type="password" placeholder="Password" className="w-full border p-2 rounded" required />
				<select name="role" className="w-full border p-2 rounded" required>
					<option value="student">Student</option>
					<option value="staff">Staff</option>
					<option value="admin">Admin</option>
				</select>
				{error && <p className="text-red-600 text-sm">{error}</p>}
				<button disabled={loading} className="w-full bg-green-600 text-white py-2 rounded">{loading ? 'Creating...' : 'Register'}</button>
				<p className="text-xs text-gray-500 text-center">Note: Only VIT email addresses (@vit.edu.in) are allowed</p>
				<p className="text-sm text-center">Have an account? <Link to="/login" className="text-blue-600">Login</Link></p>
			</form>
		</div>
	)
}
