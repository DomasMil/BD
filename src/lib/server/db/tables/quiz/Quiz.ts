import type { Database } from "better-sqlite3";
import type { QuizType } from "./QuizType";
import type { QuestionType } from "../question/QuestionType";
import type { AnswerType } from "../answer/AnswerType";
import { getQuestionsByQuizId } from "../question/Question";
import { getAnswersByQuestionId } from '../answer/Answer';
import { addAttempt, updateAttempt } from "../attempt/Attempt";
import { addAnsweredQuestionsFromQuiz } from "../answeredQuestions/AnsweredQuestions";
import { addPointsToUser } from "../user/User";

let db: Database;

export function addQuizTable(database: Database) {
	const sql = `
	create table if not exists quizzes (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
        title 			TEXT NOT NULL,
        join_code 		INTEGER,
        can_navigate 	BOOLEAN,
        duration 		INTEGER,
        is_reusable 	BOOLEAN,
		creator_id 		INTEGER NOT NULL,
        creation_date   INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
		FOREIGN KEY (creator_id) REFERENCES users(id)
	);`;
	const stmnt = database.prepare(sql);
	stmnt.run();

    db = database;
}


//================================================================================================
//QUIZ TABLE
export function deleteQuiz(quiz_id: number) {
    const deleteTransaction = db.transaction(() => {
        let sql = `DELETE FROM answers WHERE question_id IN 
                   (SELECT id FROM questions WHERE quiz_id = $quiz_id)`;
        let stmnt = db.prepare(sql);
        stmnt.run({ quiz_id });

        sql = `DELETE FROM questions WHERE quiz_id = $quiz_id`;
        stmnt = db.prepare(sql);
        stmnt.run({ quiz_id });

        sql = `DELETE FROM quizzes WHERE id = $quiz_id`;
        stmnt = db.prepare(sql);
        stmnt.run({ quiz_id });
    });

    deleteTransaction();
}

export async function insertQuiz(quiz: QuizType): Promise<void> {
    const quizSql =
        'insert into quizzes (title, join_code, can_navigate, duration, is_reusable, creator_id) values (?, ?, ?, ?, ?, ?)';
    const quizStmnt = db.prepare(quizSql);
    const quizResult = quizStmnt.run(quiz.title, quiz.code, quiz.can_navigate, quiz.duration, quiz.is_reusable, quiz.creator_id);

    const quizId = quizResult.lastInsertRowid; 

    if (quiz.questions && quiz.questions.length) {
        quiz.questions.forEach((question: QuestionType) => {
            const questionSql = 'insert into questions (quiz_id, question_text) values (?, ?)';
            const questionStmnt = db.prepare(questionSql);
            const questionResult = questionStmnt.run(quizId, question.question_text);

            const questionId = questionResult.lastInsertRowid;

            question.answers.forEach((answer: AnswerType) => {
                const answerSql = 'insert into answers (question_id, answer_text, is_correct) values (?, ?, ?)';
                const answerStmnt = db.prepare(answerSql);
                answerStmnt.run(questionId, answer.answer_text, (answer.is_correct ? 1 : 0));
            });
        });
    }
}

export async function updateQuiz(quiz: QuizType) {
    const quizSql = 'update quizzes set title = ?, join_code = ?, can_navigate = ?, duration = ?, is_reusable = ?, creator_id = ? where id = ?';
    const quizStmnt = db.prepare(quizSql);
    quizStmnt.run(quiz.title, quiz.code, quiz.can_navigate, quiz.duration, quiz.is_reusable, quiz.creator_id, quiz.id);

    const existingQuestionIds = (db.prepare('SELECT id FROM questions WHERE quiz_id = ?').all(quiz.id) as QuestionType[]).map((q: QuestionType) => q.id);
    const currentQuestionIds = quiz.questions?.map(q => q.id).filter(id => id != null);
    const removedQuestionIds = existingQuestionIds.filter(id => !currentQuestionIds?.includes(id));
    removedQuestionIds.forEach(id => {
        db.prepare('DELETE FROM answers WHERE question_id = ?').run(id);
        db.prepare('DELETE FROM questions WHERE id = ?').run(id);
    });

    if (quiz.questions) {
        for (const question of quiz.questions) {
            let questionId = question.id;

            if (!questionId) {
                const insertQuestionSql = 'insert into questions (quiz_id, question_text) values (?, ?)';
                const insertQuestionStmnt = db.prepare(insertQuestionSql);
                const result = insertQuestionStmnt.run(quiz.id, question.question_text);
                questionId = Number(result.lastInsertRowid);
            } else {
                const updateQuestionSql = 'update questions set quiz_id = ?, question_text = ? where id = ?';
                const updateQuestionStmnt = db.prepare(updateQuestionSql);
                updateQuestionStmnt.run(quiz.id, question.question_text, questionId);
            }

            const existingAnswerIds = (db.prepare('SELECT id FROM answers WHERE question_id = ?').all(questionId) as AnswerType[]).map((a: AnswerType) => a.id);
            const currentAnswerIds = question.answers.map(a => a.id).filter(id => id != null);
            const removedAnswerIds = existingAnswerIds.filter(id => !currentAnswerIds.includes(id));
            removedAnswerIds.forEach(id => {
                db.prepare('DELETE FROM answers WHERE id = ?').run(id);
            });

            for (const answer of question.answers) {
                if (!answer.id) {
                    const insertAnswerSql = 'insert into answers (question_id, answer_text, is_correct) values (?, ?, ?)';
                    const insertAnswerStmnt = db.prepare(insertAnswerSql);
                    insertAnswerStmnt.run(questionId, answer.answer_text, answer.is_correct ? 1 : 0);
                } else {
                    const updateAnswerSql = 'update answers set question_id = ?, answer_text = ?, is_correct = ? where id = ?';
                    const updateAnswerStmnt = db.prepare(updateAnswerSql);
                    updateAnswerStmnt.run(questionId, answer.answer_text, answer.is_correct ? 1 : 0, answer.id);
                }
            }
        }
    }
}

export function submitQuiz(quiz: QuizType, user_id: number) {
    let score = 0;

    if (quiz.questions && quiz.id) {
        const attempt_id = addAttempt(quiz.id, user_id);

        quiz.questions.forEach((question: QuestionType) => {
            if (!question.id) return;

            const correctAnswers = getAnswersByQuestionId(question.id)
                .filter((answer: AnswerType) => answer.is_correct)
                .map(answer => answer.id);

            const userAnswers = question.answers
                .filter((answer: AnswerType) => answer.is_correct)
                .map(answer => answer.id);
 
            if (correctAnswers.length === userAnswers.length && 
                correctAnswers.every((answerId) => userAnswers.includes(answerId))) {
                score++;
            }

            userAnswers.forEach(answerId => {
                if(!quiz.id || !question.id || answerId === undefined) return;
                addAnsweredQuestionsFromQuiz(attempt_id, quiz.id, question.id, answerId);
            });
        });

        updateAttempt(attempt_id, score);
        addPointsToUser(user_id, score);
    }

    return score;
}

    

export function getQuizByCode(code: string): number {
    const sql = `
        SELECT id
        FROM quizzes
        WHERE join_code = $code
    `;

    const stmnt = db.prepare(sql);
    const row = stmnt.get({ code }) as { id: number } | undefined;

    return row ? row.id : 0;
}


export function getQuizByID(quizId: number): QuizType{
    const sql = `
        SELECT *
        FROM quizzes
        WHERE id = $quizId
    `;
    const stmnt = db.prepare(sql);
    const row = stmnt.get({ quizId }) as QuizType;


	return row ? row : {} as QuizType;
}

export function getQuizzesByCreatorId(creator_id: number): QuizType[] {
    const sql = `
        SELECT *
        FROM quizzes
        WHERE creator_id = $creator_id`;

    try {
        const stmnt = db.prepare(sql);
        const rows = stmnt.all({ creator_id }) as QuizType[];

        return rows;
    } catch (error) {
        console.error("Error fetching quizzes:", error);
        return [] as QuizType[];
    }
}

export function updateQuizzJoinCode(quizzId: number, newJoinCode:number): void {
    const sql = `
        UPDATE quizzes
        SET join_code = ?
        WHERE id = ?`;

    const stmnt = db.prepare(sql);
    stmnt.run(newJoinCode, quizzId);
}

export function getQuizByQuizIdNested(quizId: number): QuizType{
    const quiz = getQuizByID(quizId);
    
    quiz.questions = getQuestionsByQuizId(quizId)

    const nestedQuestions: QuestionType[] = [] as QuestionType[];

    quiz.questions.forEach((question: QuestionType) => {
        if(!question.id) return;

        question.answers = getAnswersByQuestionId(question.id);
        nestedQuestions.push(question);
    });

    quiz.questions = nestedQuestions;

    //console.log(quiz)

    return quiz as QuizType;
}

export function getAllQuizzes(): QuizType[] {
    const sql = `
        SELECT *
        FROM quizzes`;

    const stmnt = db.prepare(sql);
    const quizzes = stmnt.all() as QuizType[];

    quizzes.forEach((quiz: QuizType) => {
        if(!quiz.id) return;

        quiz.questions = getQuestionsByQuizId(quiz.id);
    });

    return quizzes;
}

export function getAllQuizzesByCreatorId(creator_id: number): QuizType[] {
    const sql = `
        SELECT *
        FROM quizzes
        WHERE creator_id = $creator_id`;

    const stmnt = db.prepare(sql);
    const quizzes = stmnt.all({ creator_id }) as QuizType[];

    quizzes.forEach((quiz: QuizType) => {
        if(!quiz.id) return;

        quiz.questions = getQuestionsByQuizId(quiz.id);
    });

    return quizzes;
}

export function getAllReusableQuizes(): QuizType[]{
    const sql = `
        SELECT *
        FROM quizzes`;
        // WHERE is_reusable = 1`;

    const stmnt = db.prepare(sql);
    const rows = stmnt.all() as QuizType[];


	return rows ? rows : {} as QuizType[];
}