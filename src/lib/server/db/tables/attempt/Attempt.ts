import type { Database } from "better-sqlite3";
import type { AttemptType } from "./AttemptType";
import type { QuizType } from "../quiz/QuizType";

import { getQuizByQuizIdNested } from "../quiz/Quiz";
import { getAnsweredQuesitonsByAttemptId } from "../answeredQuestions/AnsweredQuestions";

let db: Database;

export function addAttemptTable(database :Database) {
    const sql = `
    CREATE TABLE IF NOT EXISTS attempt (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        quiz_id INTEGER,
        user_id INTEGER,
        result INTEGER,
        date INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000)
    );`;
    const stmnt = database.prepare(sql);
    stmnt.run();
    db = database
}

export function addAttempt(quizId: number, userId: number): number {
    const sql = `
    INSERT INTO attempt (quiz_id, user_id, result)
    VALUES (?, ?, ?);`;
    const stmnt = db.prepare(sql);
    const stmntResult = stmnt.run(quizId, userId, 0);
    
    return stmntResult.lastInsertRowid as number;
}

export function updateAttempt(attemptId: number, result: number) {
    const sql = `
    UPDATE attempt
    SET result = $result
    WHERE id = $attemptId;`;
    const stmnt = db.prepare(sql);
    stmnt.run({ attemptId, result });
}

export function getAttemptsByUserId(userId: number): AttemptType[] {
    const sql = `
    SELECT * FROM attempt WHERE user_id = $userId`;
    const stmnt = db.prepare(sql);

    const attempts = stmnt.all({ userId }) as AttemptType[];

    attempts.forEach((attempt: any) => {
        attempt.quiz = getQuizByQuizIdNested(attempt.quiz_id) as QuizType;
        attempt.date = new Date(attempt.date);
        attempt.answeredQuestions = getAnsweredQuesitonsByAttemptId(attempt.id);
    });

    return attempts;
}

export function getAttemptsByQuizId(quizId: number): AttemptType[] {
    const sql = `
    SELECT * FROM attempt WHERE quiz_id = $quizId`;
    const stmnt = db.prepare(sql);

    const attempts = stmnt.all({ quizId }) as AttemptType[];

    attempts.forEach((attempt: any) => {
        attempt.quiz = getQuizByQuizIdNested(attempt.quiz_id) as QuizType;
        attempt.date = new Date(attempt.date);
        attempt.answeredQuestions = getAnsweredQuesitonsByAttemptId(attempt.id);
    });

    return attempts;
}