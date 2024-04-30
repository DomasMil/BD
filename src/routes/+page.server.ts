import type { PageServerLoad } from './$types';
import type { Actions } from '@sveltejs/kit';
import { getQuizByCode } from '$lib/server/db/tables/quiz/Quiz';
import { redirect, error } from '@sveltejs/kit';

export const load = (({ locals }) => { 
	const { username, role} = locals;

	return {
		loggedIn: !!username,
		role: role
	};
}) satisfies PageServerLoad;


export const actions: Actions = {
    joinTest: async ({ request }) => {
        const data = await request.formData();
        //console.log(data);

        let joinCodeStr = data.get('joinCodeInput')?.toString() || '';

        const quiz = getQuizByCode(joinCodeStr);
		//console.log(quiz);
		if(quiz){
			throw redirect(303, `/user/${quiz}/attempt`);
		}else{
			throw error(401, {
				message: 'Toks testas neegzistuoja!'
			});
		}
    }
};