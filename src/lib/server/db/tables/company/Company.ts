import type { Database } from "better-sqlite3";
import bcrypt from 'bcrypt';
import type { CompanyType } from "./CompanyType";

import { pool } from '../../index';

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