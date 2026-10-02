import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { config } from "@/config";
import en from "@/locales/en.json";

// ponytail: en only; add a language detector when a 2nd locale exists
void i18n.use(initReactI18next).init({
	lng: config.i18n.defaultLocale,
	resources: { [config.i18n.defaultLocale]: { translation: en } },
	pluralSeparator: config.i18n.pluralSeparator,
	interpolation: { escapeValue: false },
	initAsync: false,
});

export default i18n;
