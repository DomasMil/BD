import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { insertQuiz } from '$lib/server/db/tables/quiz/Quiz';
import type { QuizType } from '$lib/server/db/tables/quiz/QuizType';

export const POST: RequestHandler = async ({ request }) => {
    const body = await request.json();
    console.log(body);

	const quiz = body as QuizType;

    await insertQuiz(quiz);

    return json({ status: 200 });
};
