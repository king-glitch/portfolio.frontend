import { z } from "zod";
import { ContentStatus } from "@/api/types/admin/enums";
import type {
	AdminNote,
	AdminNoteDetail,
	AdminProject,
	AdminProjectDetail,
	ProjectRef,
	StoredBlock,
} from "@/api/types/admin/content";
import type { AdminFrame, AdminFramePage } from "@/api/types/admin/gallery";
import {
	FileKind,
	type AdminFile,
	type FilePage,
} from "@/api/types/admin/storage";
import type { AdminUser, Session } from "@/api/types/admin/auth";
import type { Setting } from "@/api/types/admin/setting";
import {
	MotifKind,
	ProjectLifecycle,
	ProjectSide,
} from "@/api/types/portfolio/enums";

/** Admin responses (snake_case wire) parsed into the dashboard's models. */

const items = z.array(z.string());
const blocks = z.array(z.record(z.string(), z.unknown()));

export const sessionSchema: z.ZodType<Session> = z
	.object({
		session: z.object({ token: z.string(), expires_at: z.string() }),
	})
	.transform(({ session }) => ({
		token: session.token,
		expiresAt: session.expires_at,
	}));

export const adminUserSchema: z.ZodType<AdminUser> = z
	.object({
		id: z.string(),
		username: z.string(),
		last_login_at: z.string().nullable(),
	})
	.transform(({ last_login_at, ...rest }) => ({
		...rest,
		lastLoginAt: last_login_at,
	}));

export const recoveryCodeSchema = z
	.object({ recovery_code: z.string() })
	.transform(({ recovery_code }) => recovery_code);

const projectRef: z.ZodType<ProjectRef> = z.object({
	id: z.string(),
	slug: z.string(),
	name: z.string(),
});

const projectFields = {
	id: z.string(),
	slug: z.string(),
	num: z.string(),
	name: z.string(),
	full: z.string(),
	kind: z.enum(MotifKind),
	side: z.enum(ProjectSide),
	tags: items,
	categories: z.array(z.string()),
	stack: items,
	about: z.string(),
	role: items,
	art_url: z.string().optional(),
	position: z.string().default(""),
	period: z.string().default(""),
	team: z.string().default(""),
	lifecycle: z.enum(ProjectLifecycle).or(z.literal("")).catch(""),
	platforms: items.default([]),
	chains: items.default([]),
	links: z
		.array(z.object({ label: z.string(), url: z.string() }))
		.default([]),
	status: z.enum(ContentStatus),
	order: z.number(),
};

const toProject = ({
	art_url,
	...rest
}: z.output<z.ZodObject<typeof projectFields>>): AdminProject => ({
	...rest,
	artUrl: art_url ?? "",
});

export const adminProjectListSchema: z.ZodType<AdminProject[]> = z
	.object({ projects: z.array(z.object(projectFields)) })
	.transform(({ projects }) => projects.map(toProject));

export const adminProjectSchema: z.ZodType<AdminProjectDetail> = z
	.object({ ...projectFields, blocks })
	.transform(({ blocks: stored, ...rest }) => ({
		...toProject(rest),
		blocks: stored satisfies StoredBlock[],
	}));

const noteFields = {
	id: z.string(),
	slug: z.string(),
	num: z.string(),
	title: z.string(),
	published_at: z.string().nullable(),
	tags: items,
	kind: z.enum(MotifKind),
	excerpt: z.string(),
	read_minutes: z.number(),
	sample: z.boolean(),
	art_url: z.string().optional(),
	project: projectRef.nullable(),
	status: z.enum(ContentStatus),
};

const toNote = ({
	published_at,
	read_minutes,
	art_url,
	...rest
}: z.output<z.ZodObject<typeof noteFields>>): AdminNote => ({
	...rest,
	publishedAt: published_at,
	readMinutes: read_minutes,
	artUrl: art_url ?? "",
});

export const adminNoteListSchema: z.ZodType<AdminNote[]> = z
	.object({ notes: z.array(z.object(noteFields)) })
	.transform(({ notes }) => notes.map(toNote));

export const adminNoteSchema: z.ZodType<AdminNoteDetail> = z
	.object({ ...noteFields, blocks })
	.transform(({ blocks: stored, ...rest }) => ({
		...toNote(rest),
		blocks: stored satisfies StoredBlock[],
	}));

const frameFields = {
	id: z.string(),
	file_id: z.string(),
	alt: z.string(),
	project: projectRef.nullable(),
	tags: items,
	width: z.number(),
	height: z.number(),
	image_url: z.string(),
};

const toFrame = ({
	file_id,
	image_url,
	...rest
}: z.output<z.ZodObject<typeof frameFields>>): AdminFrame => ({
	...rest,
	fileId: file_id,
	imageUrl: image_url,
});

export const adminFramePageSchema: z.ZodType<AdminFramePage> = z
	.object({
		items: z.array(z.object(frameFields)),
		next_cursor: z.string().nullable(),
	})
	.transform(({ items: frames, next_cursor }) => ({
		frames: frames.map(toFrame),
		nextCursor: next_cursor,
	}));

export const adminFrameSchema: z.ZodType<AdminFrame> = z
	.object(frameFields)
	.transform(toFrame);

const fileFields = {
	id: z.string(),
	kind: z.enum(FileKind),
	mime: z.string(),
	size: z.number(),
	width: z.number(),
	height: z.number(),
	name: z.string(),
	alt: z.string(),
	url: z.string(),
	created_at: z.string(),
};

const toFile = ({
	created_at,
	...rest
}: z.output<z.ZodObject<typeof fileFields>>): AdminFile => ({
	...rest,
	createdAt: created_at,
});

export const adminFileSchema: z.ZodType<AdminFile> = z
	.object(fileFields)
	.transform(toFile);

export const adminFilePageSchema: z.ZodType<FilePage> = z
	.object({
		items: z.array(z.object(fileFields)),
		next_cursor: z.string().nullable(),
	})
	.transform(({ items: files, next_cursor }) => ({
		files: files.map(toFile),
		nextCursor: next_cursor,
	}));

export const settingListSchema: z.ZodType<Setting[]> = z
	.object({
		settings: z.array(
			z.object({
				key: z.string(),
				value: z.unknown(),
				is_public: z.boolean(),
			}),
		),
	})
	.transform(({ settings }) =>
		settings.map(({ is_public, ...rest }) => ({
			...rest,
			isPublic: is_public,
		})),
	);
