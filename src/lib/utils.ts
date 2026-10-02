export { cn } from "cn";

/** "https://www.github.com/x" -> "github.com/x", for showing links as text. */
export const displayUrl = (url: string): string =>
	url.replace(/^https?:\/\/(www\.)?/, "");
