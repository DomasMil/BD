import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { MyUserType } from '$lib/server/db/tables/user/UserType';
import { getUserById, updateUserPassword } from '$lib/server/db/tables/user/User';
import { parse } from 'cookie';
import { fail, redirect, type Actions} from '@sveltejs/kit';
import { checkUserCredentials, findUserByUsername } from '$lib/server/db/tables/user/User';
// import { USERNAME } from '$env/static/private';

export const load = async ({ request, depends }) => {
    depends('template:load');
    const cookies = request.headers.get('cookie');
    const { user_id, username, } = parse(cookies || '');

    let user: MyUserType = await getUserById(Number(user_id));
    //console.log('user', user);
    return {
        user
    };
}

export const actions: Actions = {
	changepassword: async ({ request, cookies }) => {
        const data = await request.formData();
        const oldpassword = data.get('oldpassword')?.toString();
        const newpassword = data.get('newpassword')?.toString();
        const username = data.get('username')?.toString();

        if (username && oldpassword) {
			const res = await checkUserCredentials(username, oldpassword);
			if (!res) {
                throw redirect(303, '/profile?failed');
			}
            if (newpassword) {			
                await updateUserPassword(username, newpassword);
                throw redirect(303, '/profile?success');}
		} else {
			return fail(400, { errorMessage: 'Trūksta prisijungimo vardo arba slaptažodžio' });
		}
        // if (name && username && password && email && company && role) {
        //     createUser(name, username, password, email, Number(company), role);
        //    return {
        //         status: 303,
        //         headers: {
        //             'Location': `/`,
        //             'Refresh': '0;url=/'
        //         }
        //     }
        // } else {
        //     return fail(400, { errorMessage: 'Missing username or password' });
        // }
	}   
};