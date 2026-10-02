import { config } from "@/config";

export const sleep = (ms: number = config.mock.latencyMs) =>
	new Promise<void>((resolve) => setTimeout(resolve, ms));
