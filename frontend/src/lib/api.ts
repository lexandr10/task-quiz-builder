import axios from "axios";

const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export const api = axios.create({ baseURL: BASE, timeout: 10000 })

api.interceptors.response.use((req) => req, (err) => {
	const msg = err?.responce?.data?.message || err?.message || 'Request failed'
	return Promise.reject(new Error(msg))
} )
