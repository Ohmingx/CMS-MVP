import { create } from 'zustand'
import api from '../api/client'

export const useAuthStore = create((set, get) => ({
	user: null,
	token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
	loading: false,
	error: null,
	init: async () => {
		const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
		if (!token) return
		try {
			const { data } = await api.get('/auth/me')
			set({ user: data.user, token })
		} catch {
			if (typeof window !== 'undefined') localStorage.removeItem('token')
			set({ user: null, token: null })
		}
	},
	login: async (username, password) => {
		set({ loading: true, error: null })
		try {
			const { data } = await api.post('/auth/login', { username, password })
			localStorage.setItem('token', data.token)
			set({ user: data.user, token: data.token, loading: false })
			return true
		} catch (e) {
			set({ error: e?.response?.data?.message || 'Login failed', loading: false })
			return false
		}
	},
	register: async (username, password, role) => {
		set({ loading: true, error: null })
		try {
			const { data } = await api.post('/auth/register', { username, password, role })
			localStorage.setItem('token', data.token)
			set({ user: data.user, token: data.token, loading: false })
			return true
		} catch (e) {
			set({ error: e?.response?.data?.message || 'Register failed', loading: false })
			return false
		}
	},
	logout: () => {
		localStorage.removeItem('token')
		set({ user: null, token: null })
	},
}))
