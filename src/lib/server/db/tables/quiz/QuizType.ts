import type { QuestionType } from "../question/QuestionType";

export type QuizType = {
	id?: number;
	title: string;
	code: number;
	can_navigate: number; //BOOLEAN
	duration: number;
	is_reusable: number; //BOOLEAN
	creation_date?: number | null;
	questions?: QuestionType[] | null;
	creator_id?: number;
};