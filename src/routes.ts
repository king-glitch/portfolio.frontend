import {
	type RouteConfig,
	index,
	layout,
	route,
} from "@react-router/dev/routes";
import { config } from "./config";

/** "/work/:projectId" under "" -> "work/:projectId"; "/about/explore" under "/about" -> "explore". */
const segment = (full: string, parent = "") =>
	full.slice(parent.length).replace(/^\//, "");

export default [
	layout("routes/layout.tsx", [
		index("routes/index.tsx"),
		route(
			segment(config.routes.work),
			"routes/work/[project-id]/index.tsx",
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
		route(segment(config.routes.notes), "routes/notes/index.tsx"),
		route(segment(config.routes.note), "routes/notes/[slug]/index.tsx"),
	]),
] satisfies RouteConfig;
