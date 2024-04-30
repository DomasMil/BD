import type { QuestionType } from "../question/QuestionType";

export type ComplaintType = {
    id: number,
    question: QuestionType,
    explanation: string,
    reporter_id: number,
    quiz_id: number
    question_id: number,
};
