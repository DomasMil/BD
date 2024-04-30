import type { Database } from "better-sqlite3";
import bcrypt from 'bcrypt';
import type { UserType, MyUserType } from "./UserType";

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


export async function getUsers() {
    const [result] = await pool.query('SELECT * FROM users')
    return result
}

export async function getUserById(id: number) {
    const [result] = await pool.query('SELECT * FROM users WHERE id = ?', [id])
    return result

}

export async function getUsersByCompanyId(id: number) {
	const [user]: any[] = await pool.query('SELECT * FROM users WHERE id = ?', [id])
    const companyId = user[0].companyId
	const [result] = await pool.query('SELECT * FROM users WHERE companyId = ?', [companyId])
	return result
}

export async function findUserByUsername(username: string) {
    const [result]: any[] = await pool.query('SELECT * FROM users WHERE username = ?', [username])
    const id = result[0].id
    return getUserById(id)
}

export async function createUser(username: string, password: string, name: string, email: string, companyId: number, role: string) {
	try {
		const salt = bcrypt.genSaltSync(12);
		const hashed_password = bcrypt.hashSync(password, salt);
		const [result]: any[] = await pool.query("INSERT INTO users (username, password, name, email, companyId, role) VALUES(?, ?, ?, ?, ?, ?)", [username, hashed_password, name, email, companyId, role]);
		const id = result.id;
		return getUserById(id);
	} catch (error: any) {
		if (error.code === 'ER_DUP_ENTRY') {
			throw new Error('Username already exists.');
		} else {
			throw new Error('Error creating user.');
		}
	}
}

export async function checkUserCredentials(username: string, password: string): Promise<boolean> {
    const sql = `
        SELECT password
        FROM users
        WHERE username = ?
    `;
    const [rows] = await pool.query(sql, [username]);
    const row = (rows as { password: string }[])[0];
    if (row) {
        return await bcrypt.compare(password, row.password);
    } else {
        return false;
    }
}




let db : Database;

export function addUserTable(database: Database) {
	const sql = `
	create table if not exists users (
		id          integer primary key autoincrement,
		name        text not null,
		username    text not null,
		password    text not null,
		email       text not null,
		role        text not null,
		points      integer not null,
		register_date integer not null default (strftime('%s', 'now') * 1000)
	);`;
	const stmnt = database.prepare(sql);
	stmnt.run();

	db = database;
}

// export async function createUser(
// 	name: string,
// 	username: string,
// 	password: string,
// 	email: string
// ): Promise<void> {
// 	const sql = `
// 		insert into users (name, username, password, email, role, points)
// 		values ($name, $username, $password, $email, 'student', 0)
// 	`;

// 	const hashedPassword = await bcrypt.hash(password, 12);

// 	const stmnt = db.prepare(sql);
// 	stmnt.run({ name, username, password: hashedPassword, email });
// }

// export async function checkUserCredentials(username: string, password: string): Promise<boolean> {
// 	const sql = `
//   select password
//     from users
//    where username = $username
// `;
// 	const stmnt = db.prepare(sql);
// 	const row = stmnt.get({ username }) as { password: string };
// 	if (row) {
// 		return bcrypt.compare(password, row.password);
// 	} else {
// 		await bcrypt.hash(password, 12);
// 		return false;
// 	}
// }

// export function getUserById(id: number): UserType {
// 	const sql = `
//   select *
// 	from users
//    where id = $id
// `;
// 	const stmnt = db.prepare(sql);
// 	const user = stmnt.get({ id }) as UserType;

// 	user.register_date = new Date(user.register_date);
// 	user.attempts = getAttemptsByUserId(id);
	
// 	return user;
// }

// export function getUsers(): UserType[] {
// 	const sql = `
//   select *
// 	from users
// `;
// 	const stmnt = db.prepare(sql);
// 	const users = stmnt.all() as UserType[];

// 	users.forEach((user: any) => {
// 		user.register_date = new Date(user.register_date);
// 		user.attempts = getAttemptsByUserId(user.id);
// 	});

// 	return users;
// }

export function addPointsToUser(user_id: number, points: number) {
	const sql = `
	update users
	   set points = points + $points
	 where id = $user_id
`;
	const stmnt = db.prepare(sql);
	stmnt.run({ user_id, points });
}

export function updateUser(user: UserType) {
	const sql = `
	update users
	   set name = $name,
		   email = $email
	 where id = $id
`;
	const stmnt = db.prepare(sql);
	stmnt.run(user);
}

export function getUserRole(username: string): string {
	const sql = `
  select role
    from users
   where username = $username
`;
	const stmnt = db.prepare(sql);
	const row = stmnt.get({ username }) as { role: string };
	if (row) {
		return row.role;
	}
	return "";
}

export function getUserPoints(username: string): number {
	const sql = `
  select points
	from users
   where username = $username
`;
	const stmnt = db.prepare(sql);
	const row = stmnt.get({ username }) as { points: number };
	if (row) {
		return row.points;
	}
	return 0;
}

export function getUserEmail(username: string): string {
	const sql = `
  select email
	from users
   where username = $username
`;
	const stmnt = db.prepare(sql);
	const row = stmnt.get({ username }) as { email: string };
	if (row) {
		return row.email;
	}
	return "";
}

export function getUserRoleByUserId(user_id: number): string {
	const sql = `
  select role
    from users
   where id = $user_id
`;
	const stmnt = db.prepare(sql);
	const row = stmnt.get({ user_id }) as { role: string };
	if (row) {
		return row.role;
	}
	return "";
}

export function getUserPointsByUserId(user_id: number): number {
	const sql = `
  select points
	from users
   where id = $user_id
`;
	const stmnt = db.prepare(sql);
	const row = stmnt.get({ user_id }) as { points: number };
	if (row) {
		return row.points;
	}
	return 0;
}

export function getUserEmailByUserId(user_id: number): string {
	const sql = `
  select email
	from users
   where id = $user_id
`;
	const stmnt = db.prepare(sql);
	const row = stmnt.get({ user_id }) as { email: string };
	if (row) {
		return row.email;
	}
	return "";
}

export function getUserIdByUsername(username: string): number {
	const sql = `
	select id
	  from users
	 where username = $username
  `;

  	const stmnt = db.prepare(sql);
	const row = stmnt.get({ username }) as { id: number };
	if (row) {
		return row.id;
	}
	return 0;
}