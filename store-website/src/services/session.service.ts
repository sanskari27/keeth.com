import api from '@/lib/api';

export async function createSession() {
	try {
		await api.post('/sessions/create-session');
	} catch (err) {}
}

export async function isLoggedIn() {
	try {
		await api.get('/sessions/validate-auth');
		return true;
	} catch (err) {
		return false;
	}
}

export async function googleLogin(code: string) {
	try {
		await api.post('/sessions/google-login', {
			token: code,
		});
	} catch (err) {}
}

export async function emailLogin(email: string, password: string) {
	try {
		await api.post('/sessions/login', {
			email,
			password,
		});
		return true;
	} catch (err) {
		return false;
	}
}
