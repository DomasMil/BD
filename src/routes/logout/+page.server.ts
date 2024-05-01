//import { deleteSession } from '$lib/server/sessionStore';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from '../$types';

export const load = (({ cookies }) => {
	// const sid = cookies.get('sid');
	// if (sid) {
	// 	cookies.delete('sid');
	// 	deleteSession(sid);
	// }
    cookies.delete('username');
	cookies.delete('role');
	cookies.delete('user_id');
	cookies.delete('loggedIn');
	cookies.delete('company_id');
	throw redirect(303, '/');
}) satisfies PageServerLoad;
