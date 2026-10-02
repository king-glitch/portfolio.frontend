import { generatePath } from "react-router";
import { config } from "@/config";

export const projectPath = (projectId: string) =>
	generatePath(config.routes.project, { projectId });

export const notePath = (slug: string) =>
	generatePath(config.routes.note, { slug });
