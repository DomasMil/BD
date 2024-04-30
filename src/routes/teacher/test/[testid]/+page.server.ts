import { error, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from '../$types';
import { getAllReusableQuizes, getQuizByQuizIdNested } from '$lib/server/db/tables/quiz/Quiz';
import { getQuestionsByQuizId } from '$lib/server/db/tables/question/Question';
import type { QuizType } from '$lib/server/db/tables/quiz/QuizType';

export const load = (({ params, locals }) => {
	// if (!locals?.role?.includes('teacher')) {
	// 	throw error(404, 'Neteisėtas prisijungimas');
	// }

    const quizID = params.testid === "create" ? -1 : parseInt(params.testid);
    const quiz = quizID === -1 ? {} : getQuizByQuizIdNested(quizID);
	const userID = locals.user_id;

	const reusableQuizes = getAllReusableQuizes();
	return {
		userID,
		quizID,
		quiz,
		reusableQuizes,
	};
}) satisfies PageServerLoad;
