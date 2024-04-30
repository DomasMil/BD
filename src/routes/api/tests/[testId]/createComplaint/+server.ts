import { insertComplaint } from '$lib/server/db/tables/complaint/Complaint';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, params, locals }) => {

    const quizId = Number(params.testId);
    const reporter_id = Number(locals.user_id);

    const body = await request.json();
    const question_id = body.question_id;
    const explanation = body.explanation;

    insertComplaint(quizId, question_id, reporter_id, explanation);
    
    return new Response(JSON.stringify({ message: 'Complaint inserted successfully' }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        }
    });
};
