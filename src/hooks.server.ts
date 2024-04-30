import { getSession } from '$lib/server/sessionStore';
import type { Handle } from '@sveltejs/kit';


export const handle = (async ({ event, resolve }) => {
	const { cookies } = event;
	const sid = cookies.get('sid');
	if (sid) {
		const session = getSession(sid);
		if (session) {
			event.locals.username = session.username;
			event.locals.email = session.email;
			event.locals.role = session.role;
			event.locals.user_id = session.user_id;
		} else {
			// session not found in our store -> remove cookie
			cookies.delete('sid');
		}
	}

	const response = await resolve(event);
	return response;
}) satisfies Handle;
