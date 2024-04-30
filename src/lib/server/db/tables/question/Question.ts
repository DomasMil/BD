import type { Database } from "better-sqlite3";
import type { QuestionType } from "./QuestionType";

let db: Database;

export function addQuestionTable(database: Database) {
    const sql = `
    CREATE TABLE IF NOT EXISTS questions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        quiz_id INTEGER,
        question_text TEXT NOT NULL
    );`;
    const stmnt = database.prepare(sql);
    stmnt.run();
    
    db = database;
}

export function getQuestionsByQuizId(quizId: number): QuestionType[]{
    const sql = `
        SELECT *
        FROM questions
        WHERE quiz_id = $quizId
    `;
    const stmnt = db.prepare(sql);
    const rows = stmnt.all({ quizId }) as QuestionType[];

    return rows as QuestionType[];
}
