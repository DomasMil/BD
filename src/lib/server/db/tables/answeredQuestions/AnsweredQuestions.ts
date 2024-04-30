import type { Database } from "better-sqlite3";
import type { AnsweredQuestionsType } from "./AnsweredQuestionsType";

let db: Database;

export function addAnsweredQuestionsTable(database :Database) {
    const sql = `
    CREATE TABLE IF NOT EXISTS answeredQuestions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        attempt_id INTEGER,
        quiz_id INTEGER,
        question_id INTEGER,
        answer_id INTEGER
    );`;
    const stmnt = database.prepare(sql);
    stmnt.run();
    db = database
}

export function addAnsweredQuestionsFromQuiz(attempt_id: number, quiz_id: number, question_id: number, answer_id: number) {
    const sql = `
    INSERT INTO answeredQuestions (attempt_id, quiz_id, question_id, answer_id)
    VALUES (?, ?, ?, ?);`; 
    const stmnt = db.prepare(sql);
    stmnt.run(attempt_id, quiz_id, question_id, answer_id);
}

export function getAnsweredQuesitonsByAttemptId(attempt_id: number): AnsweredQuestionsType[] {
    const sql = `
    SELECT * FROM answeredQuestions WHERE attempt_id = $attempt_id`;
    const stmnt = db.prepare(sql);

    const answeredQuestions = stmnt.all({ attempt_id }) as AnsweredQuestionsType[];

    return answeredQuestions;
}