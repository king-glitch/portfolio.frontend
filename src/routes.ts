import {
	type RouteConfig,
	index,
	layout,
	route,
} from "@react-router/dev/routes";
import { config } from "./config";

/** "/projects/:projectId" under "" -> "projects/:projectId"; "/about/explore" under "/about" -> "explore". */
const segment = (full: string, parent = "") =>
	full.slice(parent.length).replace(/^\//, "");

const dashboard = config.routes.dashboard;

export default [
	route(
		segment(config.routes.dashboardLogin),
		"routes/dashboard/authentication/login/index.tsx",
	),
	route(
		segment(config.routes.dashboardRecover),
		"routes/dashboard/authentication/recover/index.tsx",
	),
	layout("routes/dashboard/layout.tsx", [
		route(segment(dashboard), "routes/dashboard/index.tsx"),
		route(
			segment(config.routes.dashboardOverview),
			"routes/dashboard/overview/index.tsx",
		),
		route(
			segment(config.routes.dashboardProjects),
			"routes/dashboard/projects/index.tsx",
		),
		route(
			segment(config.routes.dashboardProjectNew),
			"routes/dashboard/projects/new/index.tsx",
		),
		route(
			segment(config.routes.dashboardProject),
			"routes/dashboard/projects/[project-id]/index.tsx",
		),
		route(
			segment(config.routes.dashboardNotes),
			"routes/dashboard/notes/index.tsx",
		),
		route(
			segment(config.routes.dashboardNoteNew),
			"routes/dashboard/notes/new/index.tsx",
		),
		route(
			segment(config.routes.dashboardNote),
			"routes/dashboard/notes/[note-id]/index.tsx",
		),
		route(
			segment(config.routes.dashboardGallery),
			"routes/dashboard/gallery/index.tsx",
		),
		route(
			segment(config.routes.dashboardFiles),
			"routes/dashboard/files/index.tsx",
		),
		route(
			segment(config.routes.dashboardSettings),
			"routes/dashboard/settings/layout.tsx",
			[
				index("routes/dashboard/settings/index.tsx"),
				route(
					segment(
						config.routes.dashboardSettingsGeneral,
						config.routes.dashboardSettings,
					),
					"routes/dashboard/settings/general/index.tsx",
				),
				route(
					segment(
						config.routes.dashboardSettingsSeo,
						config.routes.dashboardSettings,
					),
					"routes/dashboard/settings/seo/index.tsx",
				),
				route(
					segment(
						config.routes.dashboardSettingsProfile,
						config.routes.dashboardSettings,
					),
					"routes/dashboard/settings/profile/index.tsx",
				),
				route(
					segment(
						config.routes.dashboardSettingsCategories,
						config.routes.dashboardSettings,
					),
					"routes/dashboard/settings/categories/index.tsx",
				),
			],
		),
		route(
			segment(config.routes.dashboardAccount),
			"routes/dashboard/account/index.tsx",
		),
	]),
	layout("routes/layout.tsx", [
		index("routes/index.tsx"),
		route(
			segment(config.routes.project),
			"routes/projects/[project-id]/index.tsx",
		),
		route(segment(config.routes.about), "routes/about/layout.tsx", [
			route(
				segment(config.routes.aboutExplore, config.routes.about),
				"routes/about/explore/index.tsx",
			),
			route(
				segment(config.routes.aboutResume, config.routes.about),
				"routes/about/resume/index.tsx",
			),
		]),
		route(segment(config.routes.gallery), "routes/gallery/index.tsx"),
		route(segment(config.routes.notes), "routes/notes/index.tsx"),
		route(segment(config.routes.note), "routes/notes/[slug]/index.tsx"),
	]),
] satisfies RouteConfig;
