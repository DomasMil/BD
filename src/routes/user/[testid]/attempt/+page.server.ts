import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getQuizByQuizIdNested } from '$lib/server/db/tables/quiz/Quiz';

export const load = (({ locals, request, params }) => {
	// if (locals?.role?.includes('teacher')) {
    //     window.location.href = '/teacher';
    // } else if (!locals?.role?.includes('student')) {
	// 	throw error(404, 'Neteisėtas prisijungimas');
	// }

    const testId: number = Number(params.testid);

    let quiz = getQuizByQuizIdNested(testId);

    if (!quiz.id) {
        throw error(404, 'Toks testas neegzistuoja');
    }

	return {
        quiz
    };
}) satisfies PageServerLoad;