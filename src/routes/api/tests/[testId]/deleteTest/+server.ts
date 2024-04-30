import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { deleteQuiz } from '$lib/server/db/tables/quiz/Quiz';

export const DELETE = (async ({ params }) => {
	const testId: number = Number(params.testId);

	//console.log(testId);

	if (testId !== undefined){
		await deleteQuiz(testId);
		return json({ status: 200 });
	}

	else
		return json({ status: 500 });

}) satisfies RequestHandler;
