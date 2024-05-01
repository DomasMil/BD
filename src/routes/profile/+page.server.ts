import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { MyUserType } from '$lib/server/db/tables/user/UserType';
import { getUserById } from '$lib/server/db/tables/user/User';

export const load = (({ locals }) => {
    const userId: number = Number(locals?.user_id);

    let user: MyUserType = getUserById(userId);

    return {
        user
    };
}) satisfies PageServerLoad;