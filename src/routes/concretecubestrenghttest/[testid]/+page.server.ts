import { error } from "@sveltejs/kit";
import { parse } from "cookie";
import type { StrengthTestListType } from '$lib/server/db/tables/strengthtest/StrengthTestType';

export const load = async ({ request, depends }) => {
	depends('template:load');   
    const cookies = request.headers.get('cookie');
     const { role, user_id, name, company_id } = parse(cookies || '');
	if (!role?.includes('admin' && 'employee')) {
		throw error(404, 'Neteisėtas prisijungimas');
	}
}