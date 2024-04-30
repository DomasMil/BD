export type SessionType = {
    ses_id:      string
    ses_created: number
    ses_expires: number
    ses_data:    string
}

export type SessionInfo = {
	username: string;
	email: string;
	role: string;
	user_id: number;
};

export type SessionInfoCache = SessionInfo & {
	invalidAt: number;
};
