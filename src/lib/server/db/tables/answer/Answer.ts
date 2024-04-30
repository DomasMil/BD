import type { Database } from "better-sqlite3";
import type { AnswerType } from "./AnswerType";

let db: Database;

export function addAnswerTable(database :Database) {
    const sql = `
    CREATE TABLE IF NOT EXISTS answers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        question_id INTEGER,
        answer_text TEXT NOT NULL,
        is_correct BOOLEAN
    );`;
    const stmnt = database.prepare(sql);
    stmnt.run();
    db = database
}

export function getAnswersByQuestionId(question_id: number): AnswerType[] {
    const sql = `
        SELECT *
        FROM answers
        WHERE question_id = $question_id
    `;
    const stmnt = db.prepare(sql);
    const rows = stmnt.all({ question_id }) as AnswerType[];

    return rows as AnswerType[];
}