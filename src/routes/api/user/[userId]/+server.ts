import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { UserType } from '$lib/server/db/tables/user/UserType';
import { updateUser } from '$lib/server/db/tables/user/User';

export const PUT: RequestHandler = async ({ request }) => {
    const body = await request.json();
    console.log(body);

	const user = body as UserType;

    await updateUser(user);

    return json({ status: 200 });
};
