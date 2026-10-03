import type {
	Setting,
	SettingKey,
	SettingUpdate,
} from "@/api/types/admin/setting";

/** The stored value of `key`, or undefined when the backend has no such row. */
export const settingValue = (settings: Setting[], key: SettingKey): unknown =>
	settings.find((setting) => setting.key === key)?.value;

export const update = (key: SettingKey, value: unknown): SettingUpdate => ({
	key,
	value,
});
