import type { QuestionType } from "../question/QuestionType";

export type AnsweredQuestionsType = {
	id: number;
	attempt_id: number;
	quiz_id: number;
	question_id: number;
	answer_id: number;
};