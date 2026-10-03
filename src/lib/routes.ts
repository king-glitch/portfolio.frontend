import { generatePath } from "react-router";
import { config } from "@/config";

export const projectPath = (projectId: string) =>
	generatePath(config.routes.project, { projectId });

export const notePath = (slug: string) =>
	generatePath(config.routes.note, { slug });

export const dashboardProjectPath = (projectId: string) =>
	generatePath(config.routes.dashboardProject, { projectId });

export const dashboardNotePath = (noteId: string) =>
	generatePath(config.routes.dashboardNote, { noteId });
