import { useMatch } from "react-router";
import { config } from "@/config";

/** Nav pill and terminal launcher show on Home, About and the notes list; project and note pages bring their own top bar. */
export function useChromeVisible(): boolean {
	const onWork = useMatch(config.routes.project) !== null;
	const onNote = useMatch(config.routes.note) !== null;
	return !onWork && !onNote;
}
