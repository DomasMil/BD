import type { AnswerType } from "../answer/AnswerType";

export type QuestionType = {
	id?: number,
	question_id: number;
	question_text: string;
	answers: AnswerType[];
};