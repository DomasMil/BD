import { getQuizzesByCreatorId } from '../quiz/Quiz';
import type { QuizType } from '../quiz/QuizType';
import type { Database } from "better-sqlite3";
import type { ComplaintType } from './ComplaintType';

let db: Database;

export function addComplaintTable(database :Database) {
    const sql = `
    CREATE TABLE IF NOT EXISTS complaint (
        id          INTEGER PRIMARY KEY AUTOINCREMENT,
        quiz_id     INTEGER NOT NULL,
        question_id INTEGER NOT NULL,
        reporter_id INTEGER NOT NULL,
        explanation TEXT NOT NULL
    );`;

    const stmnt = database.prepare(sql);
    stmnt.run();
    db = database
}

export function insertComplaint( quiz_id: number, 
                        question_id: number, 
                        reporter_id: number, 
                        explanation: string ): void {

    const sql = `insert into complaint (quiz_id, question_id, reporter_id, explanation)
                            values ($quiz_id, $question_id, $reporter_id, $explanation)`;

    const stmnt = db.prepare(sql);
    stmnt.run({ quiz_id, question_id, reporter_id, explanation});
}

export function getAllComplaintsByQuizId(quiz_id: number): ComplaintType[] {
    const sql = `
    SELECT *
    FROM complaint
    WHERE quiz_id = $quiz_id
    `;

    const stmnt = db.prepare(sql);
    const rows = stmnt.all({ quiz_id }) as ComplaintType[];

    return rows ? rows : {} as ComplaintType[];
}

export function getAllComplaintsByCreatorId(creator_id: number): ComplaintType[] {
    const quizes: QuizType[] = getQuizzesByCreatorId(creator_id);
    const allComplaints: ComplaintType[] = [] as ComplaintType[];
    
    quizes.forEach(quiz => {
        const tmpComplaints: ComplaintType[] = getAllComplaintsByQuizId(quiz.id === undefined ? -1: quiz.id);

        tmpComplaints.forEach(element => {
            allComplaints.push(element);
        })
        
    });

    return allComplaints;
}

export function deleteComplaint(complaint_id: number): void {
    const sql = `DELETE FROM complaint WHERE id = $complaint_id`;
    const stmnt = db.prepare(sql);
    stmnt.run({ complaint_id });
}
