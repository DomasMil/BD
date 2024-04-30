import type { AnsweredQuestionsType } from './../answeredQuestions/AnsweredQuestionsType';
import type { QuizType } from "../quiz/QuizType";

export type AttemptType = {
	id: number;
	quiz_id: number;
	user_id: number;
	result: number;
	date: Date;

	answeredQuestions: AnsweredQuestionsType[];
	quiz: QuizType;
};