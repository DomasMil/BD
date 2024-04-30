import { createUser } from '$lib/server/db/tables/user/User';
import { createSession } from '$lib/server/sessionStore';
import { fail, redirect, type Actions, type Cookies } from '@sveltejs/kit';

function performLogin(cookies: Cookies, username: string) {
	const maxAge = 1000 * 60 * 60 * 24 * 30; // 30 days
	const sid = createSession(username, maxAge);
	cookies.set('sid', sid, { maxAge });
}

export const actions: Actions = {
	register: async ({ request, cookies }) => {
		const data = await request.formData();
		const name = data.get('name')?.toString();
		const username = data.get('username')?.toString();
		const password = data.get('password')?.toString();
		const email = data.get('email')?.toString();

		if (name && username && password && email) {
			createUser(name, username, password, email);
			performLogin(cookies, username);
			throw redirect(303, '/');
		} else {
			return fail(400, { errorMessage: 'Missing username or password' });
		}
	}
};
