import React from "react";
import { useTranslation } from "react-i18next";
import i18n from "@/lib/i18n";

export function meta() {
	return [{ title: i18n.t("home.meta.title") }];
}

/** Placeholder; the home milestone replaces this file. */
interface HomeProps {}

const Home: React.FC<HomeProps> = () => {
	const { t } = useTranslation();
	return (
		<main className="flex min-h-svh items-center justify-center p-6">
			<h1 className="text-2xl font-bold">
				{t("home.placeholder.title")}
			</h1>
		</main>
	);
};

export default Home;
