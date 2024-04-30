import { error } from '@sveltejs/kit';
import type { PageServerLoad } from '../$types';
import type { UserType } from '$lib/server/db/tables/user/UserType';
import { getUsers } from '$lib/server/db/tables/user/User';

export const load = (({ locals }) => {
	if (!locals?.role?.includes('teacher')) {
		throw error(404, 'Neteisėtas prisijungimas');
	}

    let users: UserType[] = getUsers();

    return {
        users
    };
}) satisfies PageServerLoad;