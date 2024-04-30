import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { updateQuiz } from '$lib/server/db/tables/quiz/Quiz';
import type { QuizType } from '$lib/server/db/tables/quiz/QuizType';

export const PUT: RequestHandler = async ({ request, params }) => {
    const body = await request.json();
    const testId: number = Number(params.testId);

	const quiz = body as QuizType;

    await updateQuiz(quiz);

    return json({ status: 200 });
};
