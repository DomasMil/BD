import type { PageServerLoad } from './$types';
import type { Actions } from '@sveltejs/kit';
import { redirect, error } from '@sveltejs/kit';
import { parse } from 'cookie';

export const load = ({ request }) => {
    const cookies = request.headers.get('cookie');
    const { loggedIn, role, } = parse(cookies || '');

    return {
        loggedIn: !!loggedIn, // Convert string to boolean
        role: role
    };
};
