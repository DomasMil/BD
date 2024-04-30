import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getAllComplaintsByCreatorId } from '$lib/server/db/tables/complaint/Complaint';
import type { ComplaintType } from '$lib/server/db/tables/complaint/ComplaintType';
import type { QuizType } from '$lib/server/db/tables/quiz/QuizType';
import { getQuizByQuizIdNested } from '$lib/server/db/tables/quiz/Quiz';

export const load = (({ locals, depends }) => {
	depends('template:load');
	// if (!locals?.role?.includes('teacher')) {
	// 	throw error(404, 'Neteisėtas prisijungimas');
	// }

    let complaints: ComplaintType[] = [];
    const nestedQuizes: QuizType[] = [];
    if (locals?.user_id) { 
        complaints = getAllComplaintsByCreatorId(locals.user_id);
    }

    const uniqueQuizIds = new Set(complaints.map(complaint => complaint.quiz_id));

    uniqueQuizIds.forEach(quizId =>{
        const tmpNestedQuiz = getQuizByQuizIdNested(quizId);
        nestedQuizes.push(tmpNestedQuiz);
    })

    
    

    return {
        data: {
            complaints,
            nestedQuizes
        }
    };
}) satisfies PageServerLoad;