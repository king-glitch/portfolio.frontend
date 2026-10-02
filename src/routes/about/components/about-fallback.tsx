import React from "react";
import { QueryEmpty } from "@/components/common/feedback/query-empty";
import { QueryErrorAlert } from "@/components/common/feedback/query-error-alert";
import { ModeSwitch } from "@/routes/about/components/mode-switch";

interface AboutFallbackProps {
	pending: boolean;
	failed: boolean;
	onRetry: () => void;
	/** The view's own skeleton, same box as its loaded state. */
	skeleton: React.ReactNode;
}

/** Loading / error / empty screen of an About view, with the mode switch still usable. */
export const AboutFallback: React.FC<AboutFallbackProps> = ({
	pending,
	failed,
	onRetry,
	skeleton,
}) => {
	let content: React.ReactNode = (
		<div className="flex min-h-svh items-center justify-center p-6">
			<QueryEmpty titleKey="about.empty.title" />
		</div>
	);
	if (pending) content = skeleton;
	else if (failed)
		content = (
			<div className="mx-auto flex min-h-svh max-w-md items-center p-6">
				<QueryErrorAlert onRetry={onRetry} />
			</div>
		);
	return (
		<div className="relative min-h-svh">
			{content}
			<ModeSwitch />
		</div>
	);
};

export default AboutFallback;
