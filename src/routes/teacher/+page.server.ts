import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { QuizType } from '$lib/server/db/tables/quiz/QuizType';
import { getQuizzesByCreatorId } from '$lib/server/db/tables/quiz/Quiz';
import { parse } from 'cookie';

// export const load = (({ locals, depends }) => {
// 	depends('template:load');
// 	if (!locals?.role?.includes('teacher')) {
// 		throw error(404, 'Neteisėtas prisijungimas');
// 	}

//     let tests: QuizType[] = [];
//     if (locals?.user_id) { 
//         tests = getQuizzesByCreatorId(locals.user_id);
//     }

//     return {
//         data: {
//             tests
//         }
//     };
// }) satisfies PageServerLoad;


export const load = (({ request, depends }) => {
	depends('template:load');
    const cookies = request.headers.get('cookie');
    const { role, user_id } = parse(cookies || '');
	// if (!role?.includes('teacher')) {
	// 	throw error(404, 'Neteisėtas prisijungimas');
	// }

    let tests: QuizType[] = [];
    if (user_id) { 
        tests = getQuizzesByCreatorId(Number(user_id));
    }

    return {
        data: {
            tests
        }
    };
}) satisfies PageServerLoad;
