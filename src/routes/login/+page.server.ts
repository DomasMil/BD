import { checkUserCredentials } from '$lib/server/db/tables/user/User';
//import { mycheckUserCredentials } from '$lib/server/db/tables/user/User';
//import { createSession } from '$lib/server/sessionStore';
import { fail, redirect, type Actions, type Cookies } from '@sveltejs/kit';

async function performLogin(cookies: Cookies, username: string) {
	//const maxAge = 1000 * 60 * 60 * 24 * 30; // 30 days
	cookies.set('username', username);
	cookies.set('role', 'teacher');
	cookies.set('user_id', '1');
	cookies.set('company_id', '3');
	cookies.set('loggedIn', 'true');
	//const sid = createSession(username, maxAge);
	//cookies.set('sid', await sid, { maxAge });	
}

export const actions: Actions = {
	login: async ({ request, cookies }) => {
		const data = await request.formData();
		const username = data.get('username')?.toString();
		const password = data.get('password')?.toString();
		
		if (username && password) {
			const res = await checkUserCredentials(username, password);
			if (!res) {
				return fail(401, { errorMessage: 'Neteisingas prisijungimo vardas arba slaptažodis' });
			}
			performLogin(cookies, username);
			throw redirect(303, '/');
		} else {
			return fail(400, { errorMessage: 'Trūksta prisijungimo vardo arba slaptažodis' });
		}
	}
};
