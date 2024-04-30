import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { updateQuizzJoinCode } from '$lib/server/db/tables/quiz/Quiz';

export const POST = (async ({ params }) => {
	const testId: number = Number(params.testId);
	let joinCode: number = -1;

	//console.log(testId);

	if (testId !== undefined){
	    joinCode = Math.floor(Math.random() * (99999999 - 10000000 + 1)) + 10000000;
		await updateQuizzJoinCode(testId, joinCode);
		return json({ joinCode }, { status: 200 });
	}

	else
		return json({ joinCode: -1 }, { status: 500 });

}) satisfies RequestHandler;
