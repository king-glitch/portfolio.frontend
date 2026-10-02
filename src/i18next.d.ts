import "i18next";
import type en from "@/locales/en.json";

declare module "i18next" {
	interface CustomTypeOptions {
		defaultNS: "translation";
		resources: { translation: typeof en };
		// Plurals are kebab-case: `count-one` / `count-other` (src/lib/i18n.ts).
		pluralSeparator: "-";
	}
}
