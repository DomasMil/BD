import type { QuestionType } from "../../../lib/server/db/tables/question/QuestionType";
import type { AttemptType } from "../../../lib/server/db/tables/attempt/AttemptType";

export type QuizWithAttemptsType = {
	id?: number;
	title: string;
	code: number;
	navigation: number; //BOOLEAN
	duration: number;
	is_reusable: number; //BOOLEAN
	creation_date?: number | null;
	questions?: QuestionType[] | null;
	creator_id?: number;

    attempts: AttemptType[]
};