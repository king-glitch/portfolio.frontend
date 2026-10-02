import React from "react";
import { useProfile } from "@/api/hooks/portfolio/use-profile";
import { usePosts } from "@/api/hooks/portfolio/use-posts";
import { useProjects } from "@/api/hooks/portfolio/use-projects";
import {
	postsQuery,
	profileQuery,
	projectsQuery,
} from "@/api/queries/portfolio";
import i18n from "@/lib/i18n";
import { queryClient } from "@/lib/query-client";
import { preloadQueries } from "@/lib/route-data";
import { AboutFallback } from "@/routes/about/components/about-fallback";
import { WallSkeleton } from "@/routes/about/explore/components/wall/wall-skeleton";
import { ExploreWall } from "@/routes/about/explore/components/wall/explore-wall";
import type { Route } from "./+types/index";

/** Client navigations wait for this page's data, so the transition lands on the loaded page. */
export function clientLoader() {
	return preloadQueries(
		queryClient.ensureQueryData(profileQuery()),
		queryClient.ensureQueryData(projectsQuery()),
		queryClient.ensureQueryData(postsQuery()),
	);
}

export function meta(_args: Route.MetaArgs) {
	return [{ title: i18n.t("about.meta.title") }];
}

interface AboutExploreProps {}

/** `/about/explore`: the draggable wall (the notes count is optional, so posts only refine a caption). */
const AboutExplore: React.FC<AboutExploreProps> = () => {
	const profile = useProfile();
	const projects = useProjects();
	const posts = usePosts();
	if (!profile.data || !projects.data?.length)
		return (
			<AboutFallback
				pending={profile.isPending || projects.isPending}
				failed={profile.isError || projects.isError}
				onRetry={() => {
					void profile.refetch();
					void projects.refetch();
				}}
				skeleton={<WallSkeleton />}
			/>
		);
	return (
		<ExploreWall
			profile={profile.data}
			projects={projects.data}
			notesCount={posts.data?.length ?? null}
		/>
	);
};

export default AboutExplore;
