import type { Database } from "better-sqlite3";
import bcrypt from 'bcrypt';
import type { CompanyType } from "./CompanyType";

import { getAttemptsByUserId } from "../attempt/Attempt";

import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise()

export async function getCompanies() {
    const [result] = await pool.query('SELECT * FROM companies')
	console.log(result)
    return result
}

export async function getCompanyById(id: number) {
    const [result] = await pool.query('SELECT * FROM companies WHERE id = ?', [id]);
    return result;
}

export async function getCompanyNameById(id: number) {
    const [result] = await pool.query('SELECT name FROM companies WHERE id = ?', [id]);
    return result;
}