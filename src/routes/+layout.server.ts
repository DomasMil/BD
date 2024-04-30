import type { LayoutServerLoad } from './$types';
import { parse } from 'cookie';

export const load = ({ request }) => {
    const cookies = request.headers.get('cookie');
    const { username, role, } = parse(cookies || '');

    return {
        username: username,
        role: role
    };
};