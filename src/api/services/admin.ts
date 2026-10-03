import { z } from "zod";
import { HttpMethod, get, request } from "@/api/client";
import { parseBody } from "@/api/parse";
import {
	adminFramePageSchema,
	adminFrameSchema,
	adminNoteListSchema,
	adminNoteSchema,
	adminProjectListSchema,
	adminProjectSchema,
	adminUserSchema,
	recoveryCodeSchema,
	settingListSchema,
	sessionSchema,
} from "@/api/schemas/admin";
import type {
	AdminUser,
	ChangePasswordInput,
	ChangeUsernameInput,
	LoginInput,
	RecoverInput,
} from "@/api/types/admin/auth";
import type {
	AdminNote,
	AdminNoteDetail,
	AdminProject,
	AdminProjectDetail,
	NoteInput,
	ProjectInput,
} from "@/api/types/admin/content";
import type {
	AdminFrame,
	AdminFramePage,
	FrameUpdateInput,
	FrameUploadInput,
} from "@/api/types/admin/gallery";
import type { Setting, SettingUpdate } from "@/api/types/admin/setting";
import { config } from "@/config";
import { setSession } from "@/lib/auth/session";

const { auth, admin } = config.api.paths;
const { listSeparator } = config.dashboard;
const segment = encodeURIComponent;

/** Authenticated call whose body is parsed against `schema`. */
async function call<S extends z.ZodType>(
	schema: S,
	method: HttpMethod,
	path: string,
	body?: unknown,
): Promise<z.output<S>> {
	return parseBody(
		schema,
		path,
		await request(method, path, { auth: true, body }),
	);
}

/** Authenticated call whose answer is not used (`null` / a count). */
const act = (method: HttpMethod, path: string, body?: unknown) =>
	request(method, path, { auth: true, body }).then(() => undefined);

export async function login(input: LoginInput): Promise<void> {
	const data = await request(HttpMethod.Post, auth.login, { body: input });
	setSession(parseBody(sessionSchema, auth.login, data));
}

/** Signs out here even when the server cannot be reached; the session then just expires there. */
export async function logout(): Promise<void> {
	try {
		await act(HttpMethod.Post, auth.logout);
	} finally {
		setSession(null);
	}
}

export const getMe = (): Promise<AdminUser> =>
	call(adminUserSchema, HttpMethod.Get, auth.me);

export const changePassword = ({
	currentPassword,
	newPassword,
}: ChangePasswordInput) =>
	act(HttpMethod.Post, auth.changePassword, {
		current_password: currentPassword,
		new_password: newPassword,
	});

export const changeUsername = ({
	newUsername,
	password,
}: ChangeUsernameInput) =>
	act(HttpMethod.Post, auth.changeUsername, {
		new_username: newUsername,
		password,
	});

/** Returns the replacement recovery code; it is shown once. */
export async function recover({
	recoveryCode,
	newPassword,
}: RecoverInput): Promise<string> {
	const data = await request(HttpMethod.Post, auth.recover, {
		body: { recovery_code: recoveryCode, new_password: newPassword },
	});
	return parseBody(recoveryCodeSchema, auth.recover, data);
}

export const listAdminProjects = (): Promise<AdminProject[]> =>
	call(adminProjectListSchema, HttpMethod.Get, admin.projects);

export const getAdminProject = (id: string): Promise<AdminProjectDetail> =>
	call(
		adminProjectSchema,
		HttpMethod.Get,
		`${admin.projects}/${segment(id)}`,
	);

export const createProject = (
	input: ProjectInput,
): Promise<AdminProjectDetail> =>
	call(adminProjectSchema, HttpMethod.Post, admin.projects, input);

export const updateProject = (
	id: string,
	input: ProjectInput,
): Promise<AdminProjectDetail> =>
	call(
		adminProjectSchema,
		HttpMethod.Put,
		`${admin.projects}/${segment(id)}`,
		input,
	);

export const deleteProject = (id: string) =>
	act(HttpMethod.Delete, `${admin.projects}/${segment(id)}`);

/** `ids` is every project, in the new order. */
export const reorderProjects = (ids: string[]) =>
	act(HttpMethod.Put, admin.projectsOrder, { ids });

export const listAdminNotes = (): Promise<AdminNote[]> =>
	call(adminNoteListSchema, HttpMethod.Get, admin.notes);

export const getAdminNote = (id: string): Promise<AdminNoteDetail> =>
	call(adminNoteSchema, HttpMethod.Get, `${admin.notes}/${segment(id)}`);

const noteBody = ({ projectId, publishedAt, ...rest }: NoteInput) => ({
	...rest,
	project_id: projectId,
	published_at: publishedAt,
});

export const createNote = ({
	unlink: _unlink,
	...input
}: NoteInput): Promise<AdminNoteDetail> =>
	call(
		adminNoteSchema,
		HttpMethod.Post,
		admin.notes,
		noteBody({ ...input, unlink: false }),
	);

export const updateNote = (
	id: string,
	input: NoteInput,
): Promise<AdminNoteDetail> =>
	call(
		adminNoteSchema,
		HttpMethod.Put,
		`${admin.notes}/${segment(id)}`,
		noteBody(input),
	);

export const deleteNote = (id: string) =>
	act(HttpMethod.Delete, `${admin.notes}/${segment(id)}`);

/** Public listing: every frame, newest first, page by page. */
export async function listAdminFrames(cursor: string): Promise<AdminFramePage> {
	const data = await get(config.api.paths.galleryFrames, {
		[config.api.params.cursor]: cursor,
		[config.api.params.limit]: config.dashboard.framePageSize,
	});
	return parseBody(
		adminFramePageSchema,
		config.api.paths.galleryFrames,
		data,
	);
}

export async function uploadFrame({
	file,
	tags,
	projectId,
}: FrameUploadInput): Promise<AdminFrame> {
	const form = new FormData();
	form.set("file", file);
	form.set("tags", tags.join(listSeparator));
	if (projectId) form.set("project_id", projectId);
	const data = await request(HttpMethod.Post, admin.frames, {
		auth: true,
		form,
	});
	return parseBody(adminFrameSchema, admin.frames, data);
}

export async function updateFrame(
	id: string,
	{ tags, projectId }: FrameUpdateInput,
): Promise<AdminFrame> {
	const path = `${admin.frames}/${segment(id)}`;
	const data = await request(HttpMethod.Patch, path, {
		auth: true,
		body: { tags, project_id: projectId },
	});
	return parseBody(adminFrameSchema, path, data);
}

export const deleteFrame = (id: string) =>
	act(HttpMethod.Delete, `${admin.frames}/${segment(id)}`);

export const listSettings = (): Promise<Setting[]> =>
	call(settingListSchema, HttpMethod.Get, admin.settings);

export const saveSettings = (updates: SettingUpdate[]) =>
	act(HttpMethod.Put, admin.settings, { settings: updates });
