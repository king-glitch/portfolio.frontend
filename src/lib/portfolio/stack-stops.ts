import type { ProjectSummary } from "@/api/types/portfolio/project";
import type { StackStop } from "@/types/home";

/** Prototype ARCH (design/Main.dc.html line 1311). Copy lives in `home.stack.stops.<n>.*`. */
export const STACK_STOPS: StackStop[] = [
	{
		id: "client",
		nameKey: "home.stack.stops.1.name",
		descriptionKey: "home.stack.stops.1.description",
		keywords: ["client"],
	},
	{
		id: "line",
		nameKey: "home.stack.stops.2.name",
		descriptionKey: "home.stack.stops.2.description",
		keywords: ["socket", "real-time"],
	},
	{
		id: "brain",
		nameKey: "home.stack.stops.3.name",
		descriptionKey: "home.stack.stops.3.description",
		keywords: ["golang", "server-side"],
	},
	{
		id: "memory",
		nameKey: "home.stack.stops.4.name",
		descriptionKey: "home.stack.stops.4.description",
		keywords: ["mongodb", "data"],
	},
	{
		id: "rulebook",
		nameKey: "home.stack.stops.5.name",
		descriptionKey: "home.stack.stops.5.description",
		keywords: ["solidity", "smart contract"],
	},
	{
		id: "ledger",
		nameKey: "home.stack.stops.6.name",
		descriptionKey: "home.stack.stops.6.description",
		keywords: ["soneium", "blockchain", "on-chain"],
	},
];

/** Projects whose `stack` keywords touch this stop. */
export function projectsForStop(
	stop: StackStop,
	projects: ProjectSummary[],
): ProjectSummary[] {
	return projects.filter((p) =>
		p.stack.some((item) =>
			stop.keywords.some((k) => item.toLowerCase().includes(k)),
		),
	);
}
