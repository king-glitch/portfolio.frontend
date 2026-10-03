import React from "react";
import { useSettings } from "@/api/hooks/admin/settings/use-settings";
import i18n from "@/lib/i18n";
import { ProfileForm } from "@/routes/dashboard/settings/profile/components/profile-form";

export function meta() {
	return [{ title: i18n.t("dashboard.settings.profile.meta.title") }];
}

interface ProfileProps {}

/** The settings layout already handles loading, error and empty; this only renders the loaded form. */
const Profile: React.FC<ProfileProps> = () => {
	const { data } = useSettings();
	return data ? <ProfileForm settings={data} /> : null;
};

export default Profile;
