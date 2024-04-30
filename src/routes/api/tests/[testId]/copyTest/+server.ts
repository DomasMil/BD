import type { RequestHandler } from './$types';
import { getQuestionsByQuizId } from '$lib/server/db/tables/question/Question';
import type { QuizType } from '$lib/server/db/tables/quiz/QuizType';
import { getAnswersByQuestionId } from '$lib/server/db/tables/answer/Answer';
import type { QuestionType } from '$lib/server/db/tables/question/QuestionType';
import type { AnswerType } from '$lib/server/db/tables/answer/AnswerType';

export const PUT: RequestHandler = async ({ request, params }) => {

        const body = await request.json();
        const quiz = body.quiz as QuizType;
        const quizId = Number(params.testId);
        const questionsToCopy = getQuestionsByQuizId(quizId);
        
        questionsToCopy.forEach(qtc => {
            const questiontxt: string = qtc.question_text;
            const ans = getAnswersByQuestionId(qtc.id === undefined ? -1 : qtc.id) as AnswerType[];

            const question = {
                question_text: questiontxt,
                answers: ans
            } as QuestionType
            
            quiz.questions?.push(question);
            
        });

        return new Response(JSON.stringify(quiz), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
};
