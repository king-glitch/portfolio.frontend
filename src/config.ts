import { FileKind } from "./api/types/admin/storage";

/**
 * Single source of static values (AGENTS §4). Each domain sub-object is owned
 * by one agent; add a missing key only inside your own domain.
 * Query keys mirror their dotted value (rule `config-key-shape`).
 */
export const config = {
	routes: {
		home: "/",
		project: "/projects/:projectId",
		about: "/about",
		aboutExplore: "/about/explore",
		aboutResume: "/about/resume",
		notes: "/notes",
		gallery: "/gallery",
		note: "/notes/:slug",
		/** Owner-only admin app; reached through the hidden hero gesture, never linked. */
		dashboard: "/dashboard",
		dashboardLogin: "/dashboard/authentication/login",
		dashboardRecover: "/dashboard/authentication/recover",
		dashboardProjects: "/dashboard/projects",
		dashboardProjectNew: "/dashboard/projects/new",
		dashboardProject: "/dashboard/projects/:projectId",
		dashboardNotes: "/dashboard/notes",
		dashboardNoteNew: "/dashboard/notes/new",
		dashboardNote: "/dashboard/notes/:noteId",
		dashboardGallery: "/dashboard/gallery",
		dashboardFiles: "/dashboard/files",
		dashboardSettings: "/dashboard/settings",
		dashboardSettingsGeneral: "/dashboard/settings/general",
		dashboardSettingsSeo: "/dashboard/settings/seo",
		dashboardSettingsProfile: "/dashboard/settings/profile",
		dashboardSettingsCategories: "/dashboard/settings/categories",
		dashboardAccount: "/dashboard/account",
	},
	queryKeys: {
		portfolio: {
			profile: "portfolio.profile",
			categories: "portfolio.categories",
			projects: {
				list: "portfolio.projects.list",
				detail: "portfolio.projects.detail",
			},
			posts: {
				list: "portfolio.posts.list",
				detail: "portfolio.posts.detail",
			},
			gallery: {
				list: "portfolio.gallery.list",
				tags: "portfolio.gallery.tags",
			},
		},
		admin: {
			me: "admin.me",
			projects: {
				list: "admin.projects.list",
				detail: "admin.projects.detail",
			},
			notes: {
				list: "admin.notes.list",
				detail: "admin.notes.detail",
			},
			frames: "admin.frames",
			storage: {
				files: "admin.storage.files",
			},
			settings: "admin.settings",
		},
	},
	/** Owner dashboard (`/dashboard`). */
	dashboard: {
		/** Session token and expiry. ponytail: localStorage is readable by any script on the page; httpOnly cookies need backend support. */
		sessionStorageKey: "dashboard.session",
		/** Select value meaning "nothing chosen" (an empty value is ignored by the select). */
		noValue: "__none__",
		/** Frames per request in the dashboard gallery. */
		framePageSize: 24,
		/** Files per request in the file library and the picker. */
		filePageSize: 24,
		/** Search and kind filter of the files page live in these URL params. */
		fileSearchParams: { kind: "kind", q: "q" },
		/** `kind` param value meaning every kind. */
		fileKindAll: "all",
		/** Accepted MIME types per kind (an `<input accept>` value). Must equal the backend allowlist (`internal/core/constant/storage.go`). */
		fileAccept: {
			[FileKind.Image]: "image/jpeg,image/png",
			[FileKind.Video]: "video/mp4,video/webm",
			[FileKind.Audio]: "audio/mpeg,audio/ogg,audio/wav",
			[FileKind.Document]: "application/pdf,text/plain,text/csv",
			[FileKind.Archive]: "application/zip",
			[FileKind.Other]: "font/woff2,font/woff",
		} satisfies Record<FileKind, string>,
		/** Largest upload per kind in bytes (backend `APP_UPLOAD_MAX_BYTES` for images, `APP_UPLOAD_MAX_FILE_BYTES` for the rest). */
		fileMaxBytes: {
			[FileKind.Image]: 10 * 1024 * 1024,
			[FileKind.Video]: 50 * 1024 * 1024,
			[FileKind.Audio]: 50 * 1024 * 1024,
			[FileKind.Document]: 50 * 1024 * 1024,
			[FileKind.Archive]: 50 * 1024 * 1024,
			[FileKind.Other]: 50 * 1024 * 1024,
		} satisfies Record<FileKind, number>,
		/** Most tags the backend takes per item is its own limit; the form only splits the text. */
		listSeparator: ",",
	},
	api: {
		/** Backend root. Set `VITE_API_URL` per environment (see `.env.example`). */
		// ponytail: optional chaining because React Router's config loader imports this file without Vite's env
		baseUrl:
			import.meta.env?.VITE_API_URL ?? "http://localhost:8000/api/v1",
		timeoutMs: 10000,
		paths: {
			profile: "/settings/profile",
			settingsPublic: "/settings/public",
			projects: "/project/projects",
			notes: "/note/notes",
			galleryFrames: "/gallery/frames",
			galleryTags: "/gallery/tags",
			auth: {
				login: "/authentication/login",
				logout: "/authentication/logout",
				me: "/authentication/me",
				changePassword: "/authentication/change-password",
				changeUsername: "/authentication/change-username",
				recover: "/authentication/recover",
			},
			admin: {
				projects: "/project/administration/projects",
				projectsOrder: "/project/administration/projects/order",
				notes: "/note/administration/notes",
				frames: "/gallery/administration/frames",
				files: "/storage/administration/files",
				settings: "/settings/administration/settings",
			},
		},
		/** `errors.code` of a rejected session token (expired, revoked, unknown): the only 401 that signs you out. */
		invalidTokenCode: "Service.Authentication.InvalidToken",
		/** Query param names the backend expects (kebab-case). */
		params: {
			tag: "tag",
			cursor: "cursor",
			limit: "limit",
			kind: "kind",
			q: "q",
		},
	},
	gallery: {
		/** Frames per request; the server returns the next cursor with each page. */
		pageSize: 6,
		/** The next page is requested this far before the end of the list reaches the viewport. */
		loadMoreMarginPx: 600,
		/** Filter chips shown besides "All". */
		tagLimit: 10,
	},
	query: {
		// ponytail: content changes only when the owner edits it; one-minute cache, refetch on remount after that
		staleTimeMs: 60_000,
		/** Mutation `meta` key: the caller words a 409 itself, so the generic toast is skipped. */
		ownConflictMeta: "ownConflict",
		/** Retries for network, timeout, rate-limit and 5xx failures. Client errors are final. */
		retry: 2,
		retryBaseMs: 500,
		retryMaxMs: 4000,
	},
	/** `published_at` shown as "Oct 2026". */
	dateFormat: { month: "short", year: "numeric" } as const,
	/** Hidden dashboard gesture on the hero: click "Quiet", then "loud", then hold "behind". */
	secret: {
		windowMs: 6000,
		holdMs: 1500,
	},
	/** Companion mascot (bottom-right on every page). */
	companion: {
		/** How long a line stays up. */
		talkMs: 4500,
		/** No pointer, key or scroll for this long: it says its idle line (once per page). */
		idleMs: 40000,
	},
	media: {
		/** Sideways (horizontal) scrolling only on laptops/desktops; phones and tablets scroll normally. */
		horizontal: "(min-width: 1024px) and (pointer: fine)",
	},
	theme: {
		storageKey: "theme",
		darkClass: "dark",
		// ponytail: two themes, first visit follows the OS; add a "system" option if users ask
		darkQuery: "(prefers-color-scheme: dark)",
	},
	i18n: {
		// ponytail: en only; add a language detector when a 2nd locale exists
		defaultLocale: "en",
		pluralSeparator: "-",
	},
	portfolio: {
		/** The site filter's "All": a code constant, never a stored category. */
		defaultFilter: "all",
		/** Slugs the stats and the resume read (the owner may rename the labels, not these slugs). */
		categorySlugs: { games: "games", onChain: "on-chain" },
		// Search param names (overview §2).
		searchParams: { filter: "filter", tag: "tag" },
		/** Words per minute used by the build script for `readMinutes`. */
		readWordsPerMinute: 200,
	},
	/** Anchor ids of the home sections (plan 04). */
	sections: {
		top: "top",
		about: "about",
		work: "work",
		stack: "stack",
		process: "process",
		timeline: "timeline",
		skills: "skills",
		notes: "notes",
		contact: "contact",
	},
	shell: {
		preloader: {
			durationMs: 1700,
			/** Long enough for the mascot to pop and say "Ready". */
			holdMs: 520,
			unmountDelayMs: 1050,
			digits: 3,
		},
		nav: {
			heightPx: 64,
			maxWidthPx: 900,
			topPx: 20,
			revealDelayMs: 500,
			tapPx: 44,
		},
		transition: {
			durationMs: 950,
		},
		cursor: {
			ringPx: 36,
			/** `<html data-cursor="custom">` hides the system cursor (main.css). */
			htmlDataKey: "cursor",
			htmlDataValue: "custom",
			/** Filled circle over links and buttons: the blend inverts what is under it. */
			hoverRingPx: 64,
			labelRingPx: 88,
			/** I-beam over text fields. */
			textWidthPx: 2,
			textHeightPx: 30,
			lerp: 0.2,
			sizeLerp: 0.16,
			/** How far the ring is pulled from the pointer toward a magnetic element's centre. */
			magnetPull: 0.35,
			/** Squash and stretch along the movement: scale gained per px/frame, capped. */
			stretchPerPx: 0.012,
			stretchMax: 0.45,
			pressScale: 0.82,
			magnetic: { x: 0.28, y: 0.38 },
			labelAttribute: "data-cursor",
			magneticAttribute: "data-magnetic",
			hoverSelector: "a, button, [role=button], label, summary",
			textSelector:
				"input:not([type=button]):not([type=checkbox]):not([type=radio]), textarea, [contenteditable=true]",
		},
		indexPreview: {
			lerp: 0.14,
			offsetXPx: 28,
			offsetYPx: -120,
			rotateFactor: 0.08,
			rotateMaxDeg: 8,
		},
		scramble: {
			chars: "!<>-_/[]{}=+*^?#01",
			frames: 16,
			intervalMs: 32,
			cooldownMs: 400,
			attribute: "data-scramble",
		},
		menu: {
			projectRows: 6,
		},
	},
	home: {
		hero: {
			wordBaseDelayS: 0.1,
			secondLineBaseDelayS: 0.44,
			wordStaggerS: 0.08,
			fanInMs: 1400,
			fanTiltYMultiplier: 10,
			fanTiltXMultiplier: 6,
			fanTiltLerp: 0.06,
			fanMinViewportPx: 760,
			fan: {
				stepVw: 14.5,
				baseYPx: 70,
				curveYPx: 10,
				rotateDeg: 5.5,
				delayBaseS: 0.45,
				delayStepS: 0.09,
				skeletonCount: 6,
			},
		},
		marquee: {
			baseSpeedPx: 1.1,
			velocitySmoothing: 0.2,
			velocityCap: 40,
			velocityFactor: 0.6,
			skewFactor: 0.35,
			skewMaxDeg: 12,
		},
		hello: {
			countUpMs: 1600,
			countUpEasePower: 4,
			countStartViewport: 0.9,
			wordReveal: {
				startViewport: 0.85,
				endViewport: 0.55,
				minOpacity: 0.16,
				overshoot: 1.1,
			},
		},
		spotlight: {
			maxRadiusPx: 240,
			widthRatio: 0.22,
			radiusLerp: 0.12,
			centerLerp: 0.2,
		},
		index: {
			skeletonRows: 6,
		},
		stack: {
			linkDelayStepS: 0.35,
		},
		habits: {
			epsilonPx: 0.05,
			skeletonCount: 5,
		},
		timeline: {
			minBarFraction: 0.06,
		},
		toolkit: {
			gravity: 0.55,
			drag: 0.996,
			floorRestitution: 0.42,
			wallRestitution: 0.6,
			floorFriction: 0.94,
			collisionPasses: 2,
			impulse: 1.35,
			diameterBasePx: 56,
			diameterPerCharPx: 7,
			diameterMinPx: 84,
			diameterMaxPx: 168,
			fontMinPx: 13,
			fontMaxPx: 20,
			fontDivisor: 6.5,
			dropViewport: 0.8,
			stepMarginPx: 200,
			restSpeed: 0.9,
			dropSpacingPx: 46,
			dropJitterPx: 60,
			dropVx: 4,
			throwFactor: 0.9,
			skeletonCount: 14,
			/** Skill groups shown as bubbles (group index decides the style). */
			groups: 4,
		},
		notes: {
			teaserCount: 3,
		},
		contact: {
			letterWeightMax: 900,
			letterWeightMin: 200,
			letterRangePx: 360,
			fixedWeight: 800,
			epsilon: 0.05,
		},
	},
	work: {
		scroller: {
			lerp: 0.085,
			/** Duration of the next-project push (ease-in-out). */
			pushMs: 1100,
			parallaxFactor: 0.35,
			endEpsilonPx: 1,
			/** The cover counts as in place (pull may start) within this distance. */
			endCurrentPx: 48,
			settleEpsilonPx: 0.05,
			visiblePanelViewports: 1.5,
			keyStepViewport: 0.4,
			wheelLinePx: 32,
			/** Pull past the end needed to push the next project in (px of wheel input, after resistance). */
			pullThresholdPx: 1100,
			/** Resistance: gain falls from `pullBaseGain` as the pull grows, never below `pullMinGain`. */
			pullBaseGain: 0.6,
			pullSlope: 0.65,
			pullMinGain: 0.14,
			/** After this idle time the pull drains by `pullDecay` per frame. */
			pullIdleMs: 320,
			pullDecay: 0.94,
			pullZeroBelowPx: 1,
			/** Ease of the drawn progress toward the pull. */
			pullLerp: 0.2,
			/** Idle time before a mostly visible last panel snaps fully in. */
			snapIdleMs: 140,
			snapShare: 0.6,
		},
		panel: {
			wideVw: 120,
			cardVw: 82,
			cardMaxPx: 1240,
			paddingTopPx: 120,
			paddingBottomPx: 72,
		},
	},
	about: {
		wall: {
			cols: 10,
			rows: 7,
			unitPx: { desktop: 200, tablet: 176, mobile: 148 },
			desktopMinPx: 1100,
			tabletMinPx: 760,
			gapRatio: 0.08,
			hero: { col: 3, row: 2, w: 3, h: 2 },
			inertia: 0.93,
			stopBelowPx: 0.1,
			rubberBandRatio: 0.3,
			dragThresholdPx: 6,
			falloff: {
				radiusRatio: 0.62,
				scaleStart: 0.3,
				scaleDrop: 0.2,
				opacityBase: 1.5,
				opacitySlope: 1.05,
				pull: 0.07,
			},
			minimapWidthPx: 168,
			minimapMobileMaxPx: 120,
			arrowStepUnits: 1,
			follow: 0.2,
			springBack: 0.12,
			pullMax: 1.2,
			recenterOffsetYPx: 20,
			wheelLinePx: 32,
			dragFrameMs: 16,
			ripple: { staggerS: 0.45, durationS: 0.5, startScale: 0.86 },
		},
	},
	notes: {
		staggerPx: 120,
		/** sugar-high has no Solidity; its C-like JavaScript grammar reads it well. */
		codeFallbackLang: "javascript" as const,
		progress: { minHeightPx: 2 },
	},
	terminal: {
		maxLines: 160,
		navDelayMs: 450,
		lineOpacities: [1, 0.85, 0.8, 0.7, 0.6, 0.5],
		prompt: "❯",
	},
};

export type Config = typeof config;
