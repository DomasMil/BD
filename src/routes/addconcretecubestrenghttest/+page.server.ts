import type { PageServerLoad } from '../$types';
import type { MyUserType } from '$lib/server/db/tables/user/UserType';
import { getUsers } from '$lib/server/db/tables/user/User';

export const load = (({ locals }) => {
    
	// if (!locals?.role?.includes('teacher')) {
	// 	throw error(404, 'Neteisėtas prisijungimas');
	// }

    let users: MyUserType[] = getUsers();

    return {
        users
    };
}) satisfies PageServerLoad;