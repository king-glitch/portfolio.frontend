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
import type { AdminFramePage } from "@/api/types/admin/gallery";
import type { AdminUser, Session } from "@/api/types/admin/auth";
import type { Setting } from "@/api/types/admin/setting";
import {
	MotifKind,
	ProjectFilter,
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
	categories: z.array(z.enum(ProjectFilter)),
	stack: items,
	about: z.string(),
	role: items,
	status: z.enum(ContentStatus),
	order: z.number(),
};

export const adminProjectListSchema: z.ZodType<AdminProject[]> = z
	.object({ projects: z.array(z.object(projectFields)) })
	.transform(({ projects }) => projects);

export const adminProjectSchema: z.ZodType<AdminProjectDetail> = z.object({
	...projectFields,
	blocks,
});

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
	project: projectRef.nullable(),
	status: z.enum(ContentStatus),
};

const toNote = ({
	published_at,
	read_minutes,
	...rest
}: z.output<z.ZodObject<typeof noteFields>>): AdminNote => ({
	...rest,
	publishedAt: published_at,
	readMinutes: read_minutes,
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

export const adminFramePageSchema: z.ZodType<AdminFramePage> = z
	.object({
		items: z.array(
			z.object({
				id: z.string(),
				project: projectRef.nullable(),
				tags: items,
				width: z.number(),
				height: z.number(),
				image_url: z.string(),
			}),
		),
		next_cursor: z.string().nullable(),
	})
	.transform(({ items: frames, next_cursor }) => ({
		frames: frames.map(({ image_url, ...rest }) => ({
			...rest,
			imageUrl: image_url,
		})),
		nextCursor: next_cursor,
	}));

export const adminFrameSchema = z
	.object({
		id: z.string(),
		project: projectRef.nullable(),
		tags: items,
		width: z.number(),
		height: z.number(),
		image_url: z.string(),
	})
	.transform(({ image_url, ...rest }) => ({ ...rest, imageUrl: image_url }));

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
