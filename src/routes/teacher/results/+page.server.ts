import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

import type { AttemptType } from '$lib/server/db/tables/attempt/AttemptType';
import { getAttemptsByUserId } from '$lib/server/db/tables/attempt/Attempt';

import { getAllQuizzesByCreatorId } from '$lib/server/db/tables/quiz/Quiz';
import { getAttemptsByQuizId } from '$lib/server/db/tables/attempt/Attempt';
import type { QuizWithAttemptsType } from './QuizWithAttemptsType';

import { getUsers } from '$lib/server/db/tables/user/User';

export const load = (({ locals }) => {
	// if (!locals?.role?.includes('teacher')) {
	// 	throw error(404, 'Neteisėtas prisijungimas');
	// }

    const userId: number = Number(locals?.user_id);

    let quizzes: QuizWithAttemptsType[] = getAllQuizzesByCreatorId(userId) as QuizWithAttemptsType[];
    if (quizzes.length > 0) {
        quizzes.forEach((quiz: any) => {
            quiz.attempts = getAttemptsByQuizId(quiz.id);
        });
    }

    const users = getUsers();

    return {
        quizzes,
        users
    };
}) satisfies PageServerLoad;