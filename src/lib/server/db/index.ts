import Database from 'better-sqlite3';
import { DB_PATH } from '$env/static/private';

 //TABLE IMPORTS 
 import { addUserTable } from './tables/user/User';
 import { addSessionsTable } from './tables/session/Session';
 import { addQuestionTable } from './tables/question/Question';
 import { addAnswerTable } from './tables/answer/Answer';
 import { addQuizTable } from './tables/quiz/Quiz';
 import { addAttemptTable } from './tables/attempt/Attempt';
 import { addAnsweredQuestionsTable } from './tables/answeredQuestions/AnsweredQuestions';
import { addComplaintTable } from './tables/complaint/Complaint';

export function initDB(): void{
    const db = new Database(DB_PATH, { verbose: console.log });
    addSessionsTable(db);
    addUserTable(db);
    addQuestionTable(db);
    addAnswerTable(db);
    addQuizTable(db);
    addAttemptTable(db);
    addAnsweredQuestionsTable(db);
    addComplaintTable(db)
}


