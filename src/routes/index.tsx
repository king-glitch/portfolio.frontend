import React from "react";
import {
	profileQuery,
	postsQuery,
	projectsQuery,
} from "@/api/queries/portfolio";
import i18n from "@/lib/i18n";
import { queryClient } from "@/lib/query-client";
import { preloadQueries } from "@/lib/route-data";
import type { Route } from "./+types/index";
import { Contact } from "@/routes/components/home/contact/contact";
import { Habits } from "@/routes/components/home/habits/habits";
import { Hello } from "@/routes/components/home/hello/hello";
import { Hero } from "@/routes/components/home/hero/hero";
import { ProjectIndex } from "@/routes/components/home/index/project-index";
import { Marquee } from "@/routes/components/home/marquee/marquee";
import { NotesTeaser } from "@/routes/components/home/notes/notes-teaser";
import { Spotlight } from "@/routes/components/home/spotlight/spotlight";
import { StackFlow } from "@/routes/components/home/stack/stack-flow";
import { Timeline } from "@/routes/components/home/timeline/timeline";
import { Toolkit } from "@/routes/components/home/toolkit/toolkit";

/** Client navigations wait for this page's data, so the transition lands on the loaded page. */
export function clientLoader() {
	return preloadQueries(
		queryClient.ensureQueryData(profileQuery()),
		queryClient.ensureQueryData(projectsQuery()),
		queryClient.ensureQueryData(postsQuery()),
	);
}

export function meta() {
	return [{ title: i18n.t("home.meta.title") }];
}

interface HomeProps {}

/** Portfolio home: hero, marquee, about, spotlight, work index, stack, habits, timeline, toolkit, notes, contact. */
const Home: React.FC<HomeProps> = () => {
	return (
		<main id="main" className="overflow-x-clip">
			<Hero />
			<Marquee />
			<Hello />
			<Spotlight />
			<ProjectIndex />
			<StackFlow />
			<Habits />
			<Timeline />
			<Toolkit />
			<NotesTeaser />
			<Contact />
		</main>
	);
};

export default Home;
