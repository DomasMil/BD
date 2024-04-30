import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { submitQuiz } from '$lib/server/db/tables/quiz/Quiz';
import type { QuizType } from '$lib/server/db/tables/quiz/QuizType';

export const POST = (async ({ locals, request, params  }) => {
    const body = await request.json();

	const userId: number = Number(locals?.user_id);

	const quiz = body as QuizType;

	const score = submitQuiz(quiz, userId);

	return json({ score, status: 200 });

}) satisfies RequestHandler;
