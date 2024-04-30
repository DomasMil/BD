import type { LayoutServerLoad } from './$types';

export const load = (async ({ locals }) => {
	const { username, role } = locals;

	return { username, role };
}) satisfies LayoutServerLoad;
