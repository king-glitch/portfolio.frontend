export interface Session {
	token: string;
	/** ISO instant the backend stops accepting `token`. */
	expiresAt: string;
}

export interface AdminUser {
	id: string;
	username: string;
	lastLoginAt: string | null;
}

export interface LoginInput {
	username: string;
	password: string;
}

export interface ChangePasswordInput {
	currentPassword: string;
	newPassword: string;
}

export interface ChangeUsernameInput {
	newUsername: string;
	password: string;
}

export interface RecoverInput {
	recoveryCode: string;
	newPassword: string;
}
