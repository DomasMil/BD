import { error } from '@sveltejs/kit';
import type { PageServerLoad } from '../$types';
import type { MyUserType } from '$lib/server/db/tables/user/UserType';
import { getUsers } from '$lib/server/db/tables/user/User';
import { parse } from 'cookie';

// export const load = (({ locals }) => {
// 	if (!locals?.role?.includes('teacher')) {
// 		throw error(404, 'Neteisėtas prisijungimas');
// 	}

//     let users: UserType[] = getUsers();

//     return {
//         users
//     };
// }) satisfies PageServerLoad;

export const load = (({ request, depends }) => {
	depends('template:load');
    const cookies = request.headers.get('cookie');
    const { role, user_id } = parse(cookies || '');
	if (!role?.includes('admin' && 'employee')) {
		throw error(404, 'Neteisėtas prisijungimas');
	}

    let users: MyUserType[] = getUsers();

    return {
        users
    };
}) satisfies PageServerLoad;

