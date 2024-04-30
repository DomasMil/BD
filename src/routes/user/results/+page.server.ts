import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { AttemptType } from '$lib/server/db/tables/attempt/AttemptType';
import { getAttemptsByUserId } from '$lib/server/db/tables/attempt/Attempt';

export const load = (({ locals }) => {
	if (!locals?.role?.includes('student')) {
		throw error(404, 'Neteisėtas prisijungimas');
	}

    const userId: number = Number(locals?.user_id);

    let attempts: AttemptType[] = getAttemptsByUserId(userId);

    return {
        attempts
    };
}) satisfies PageServerLoad;