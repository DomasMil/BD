import { deleteDbSession, deleteExpiredDbSessions, getDbSession, insertDbSession } from '../db/tables/session/Session';
import { getUserEmailByUserId, getUserIdByUsername, getUserRoleByUserId } from '../db/tables/user/User';
import type { SessionInfo, SessionInfoCache } from './../db/tables/session/SessionType';
import { randomBytes } from 'node:crypto';
import { initDB } from '../db';

initDB();
type Sid = string;

const sessionStore = new Map<Sid, SessionInfoCache>();
let nextClean = Date.now() + 1000 * 60 * 60; // 1 hour

function clean() {
	const now = Date.now();
	for (const [sid, session] of sessionStore) {
		if (session.invalidAt < now) {
			sessionStore.delete(sid);
		}
	}
	deleteExpiredDbSessions(now);
	nextClean = Date.now() + 1000 * 60 * 60; // 1 hour
}

function getSid(): Sid {
	return randomBytes(32).toString('hex');
}

export function createSession(username: string, maxAge: number): string {
	let sid: Sid = '';

	do {
		sid = getSid();
	} while (sessionStore.has(sid));
	
	const user_id:number = getUserIdByUsername(username);
	const role = getUserRoleByUserId(user_id);
	const email = getUserEmailByUserId(user_id);
	

	const expiresAt = Date.now() + maxAge * 1000;

	const data: SessionInfo = {
		username,
		email,
		role,
		user_id
	};
	insertDbSession(sid, data, expiresAt);

	sessionStore.set(sid, {
		...data,
		invalidAt: expiresAt
	});

	if (Date.now() > nextClean) {
		setTimeout(() => {
			clean();
		}, 5000);
	}

	return sid;
}

export function getSession(sid: Sid): SessionInfo | undefined {
	if (sessionStore.has(sid)) {
		return sessionStore.get(sid);
	} else {
		const session = getDbSession(sid);
		if (session) {
			sessionStore.set(sid, session);
			return session;
		}
	}

	console.log('session not found', sid);
	return undefined;
}

export function deleteSession(sid: string): void {
	sessionStore.delete(sid);
	deleteDbSession(sid);
}
