import type { Database } from "better-sqlite3";
import type { SessionInfo, SessionInfoCache } from "./SessionType";

let db: Database;

export function addSessionsTable(database: Database) {
	const sql = `
	create table if not exists sessions (
		ses_id            text primary key
		, ses_created     integer not null default (strftime( '%s', 'now' ) * 1000)
		, ses_expires     integer not null
		, ses_data        text not null
	);`;
	const stmnt = database.prepare(sql);
	stmnt.run();

    db = database;
}

export function deleteExpiredDbSessions(now: number) {
	const sql = `
	delete from sessions
	 where ses_expires < $now
`;

	const stmnt = db.prepare(sql);
	stmnt.run({ now });
}

export function insertDbSession(sid: string, sessionInfo: SessionInfo, expiresAt: number) {
	const sql = `
	insert into sessions (ses_id, ses_expires, ses_data)
	values ($sid, $expires, $data)
`;

	const stmnt = db.prepare(sql);
	stmnt.run({ sid, expires: expiresAt, data: JSON.stringify(sessionInfo) });
}

export function deleteDbSession(sid: string) {
	const sql = `
	delete from sessions
	 where ses_id = $sid
`;
	const stmnt = db.prepare(sql);
	stmnt.run({ sid });
}

export function getDbSession(sid: string): SessionInfoCache | undefined {
	const sql = `
	select ses_data as data
	     , ses_expires as expires
	  from sessions
	 where ses_id = $sid
`;
	
	const stmnt = db.prepare(sql);
	
	const row = stmnt.get({ sid }) as { data: string; expires: number };
	if (row) {
		const data = JSON.parse(row.data);
		data.expires = row.expires;
		return data as SessionInfoCache;
	}
	return undefined;
}
