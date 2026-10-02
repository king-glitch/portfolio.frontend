import { generatePath } from "react-router";
import { config } from "@/config";

export const workPath = (projectId: string) =>
	generatePath(config.routes.work, { projectId });

export const notePath = (slug: string) =>
	generatePath(config.routes.note, { slug });
