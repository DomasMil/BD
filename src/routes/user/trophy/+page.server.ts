import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { UserType } from '$lib/server/db/tables/user/UserType';
import { getUserById } from '$lib/server/db/tables/user/User';

export const load = (({ locals }) => {
	if (!locals?.role?.includes('student')) {
		throw error(404, 'Neteisėtas prisijungimas');
	}

    const userId: number = Number(locals?.user_id);

    let user: UserType = getUserById(userId);

    return {
        user
    };
}) satisfies PageServerLoad;