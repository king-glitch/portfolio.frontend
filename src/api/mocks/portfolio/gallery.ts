import { MockScreen } from "@/api/types/portfolio/enums";
import {
	GalleryArtKind,
	type GalleryFrame,
} from "@/api/types/portfolio/gallery";
import type { ProjectSummary } from "@/api/types/portfolio/project";
import { mockMeta } from "@/lib/art/mock-meta";

const SIZE = {
	wide: { width: 640, height: 400 },
	tall: { width: 600, height: 800 },
	concept: { width: 500, height: 400 },
};

/** Frames of one project: its main screen, a second screen when the kind has one, and its concept art. */
function framesOf(project: ProjectSummary): GalleryFrame[] {
	const { kind } = project;
	const hasAlt =
		mockMeta(kind, MockScreen.Alt).labelKey !==
		mockMeta(kind, MockScreen.Main).labelKey;
	const screens = hasAlt
		? [MockScreen.Main, MockScreen.Alt]
		: [MockScreen.Main];
	const base = {
		projectId: project.id,
		projectName: project.name,
		tags: project.tags,
		imageUrl: null,
	};
	return [
		...screens.map((screen) => ({
			...base,
			...(mockMeta(kind, screen).phone ? SIZE.tall : SIZE.wide),
			id: `${project.id}-${screen}`,
			art: { kind, screen, art: GalleryArtKind.Screen },
		})),
		{
			...base,
			...SIZE.concept,
			id: `${project.id}-concept`,
			art: { kind, screen: MockScreen.Main, art: GalleryArtKind.Concept },
		},
	];
}

/** Stand-in for the server's table of uploaded frames, in project order. */
export function buildGalleryFrames(projects: ProjectSummary[]): GalleryFrame[] {
	return projects.flatMap(framesOf);
}
