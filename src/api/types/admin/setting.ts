/** Keys the backend stores (`ports.SettingKey`). */
export enum SettingKey {
	Profile = "profile",
	SiteTitle = "site_title",
	SeoDescription = "seo_description",
	SeoKeywords = "seo_keywords",
	SocialPreviewImage = "social_preview_image",
	ThemeDefault = "theme_default",
	FeatureToggles = "feature_toggles",
	MaintenanceMode = "maintenance_mode",
}

export enum ThemeDefault {
	Light = "light",
	Dark = "dark",
	System = "system",
}

export interface Setting {
	key: string;
	/** Any JSON; its shape is the backend's schema for `key`. */
	value: unknown;
	isPublic: boolean;
}

export interface SettingUpdate {
	key: string;
	value: unknown;
}
