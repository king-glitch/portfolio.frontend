// style-lint-ignore-file query-states -- AboutLayout owns loading/error/empty/retry for these same cached queries
import React from "react";
import { useProfile } from "@/api/hooks/portfolio/use-profile";
import { usePosts } from "@/api/hooks/portfolio/use-posts";
import { useProjects } from "@/api/hooks/portfolio/use-projects";
import i18n from "@/lib/i18n";
import { ExploreWall } from "@/routes/about/explore/components/wall/explore-wall";
import type { Route } from "./+types/index";

export function meta(_args: Route.MetaArgs) {
	return [{ title: i18n.t("about.meta.title") }];
}

interface AboutExploreProps {}

/** `/about/explore`: the draggable wall. The layout has already handled loading/error/empty. */
const AboutExplore: React.FC<AboutExploreProps> = () => {
	const { data: profile } = useProfile();
	const { data: projects } = useProjects();
	const { data: posts } = usePosts();
	if (!profile || !projects) return null;
	return (
		<ExploreWall
			profile={profile}
			projects={projects}
			notesCount={posts?.length ?? null}
		/>
	);
};

export default AboutExplore;
