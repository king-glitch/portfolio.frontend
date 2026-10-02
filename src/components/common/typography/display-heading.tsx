import React from "react";
import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { DisplayVariant } from "@/types/ui";

const displayVariants = cva("m-0 font-extrabold", {
	variants: {
		variant: {
			[DisplayVariant.Hero]:
				"text-[clamp(46px,8.6vw,144px)] leading-none tracking-[-0.06em]",
			[DisplayVariant.Section]:
				"text-[clamp(56px,9vw,150px)] leading-[0.88] tracking-[-0.065em]",
			[DisplayVariant.Habits]:
				"text-[clamp(64px,9vw,160px)] leading-[0.86] tracking-[-0.07em]",
			[DisplayVariant.Contact]:
				"text-[clamp(72px,17vw,300px)] leading-[0.86] tracking-[-0.06em] whitespace-nowrap",
			[DisplayVariant.Notes]:
				"text-[clamp(56px,10vw,170px)] leading-[0.84] tracking-[-0.07em]",
			[DisplayVariant.Post]:
				"text-[clamp(44px,7vw,112px)] leading-[0.92] tracking-[-0.065em]",
			[DisplayVariant.ProjectTitle]:
				"text-[clamp(56px,10.5vw,196px)] leading-[0.86] tracking-[-0.068em] wrap-break-word",
			[DisplayVariant.Panel]:
				"text-[clamp(48px,6.5vw,108px)] leading-[0.9] tracking-[-0.06em]",
			[DisplayVariant.PanelSm]:
				"text-[clamp(40px,5vw,84px)] leading-[0.9] tracking-[-0.06em]",
			[DisplayVariant.Subhead]:
				"text-[clamp(28px,3vw,48px)] leading-none tracking-[-0.045em]",
		},
	},
});

interface DisplayHeadingProps extends useRender.ComponentProps<"h2"> {
	variant?: DisplayVariant;
}

/** Huge tight display type from the prototype. Renders an h2; pass `render={<h1 />}` for the page title. */
export const DisplayHeading: React.FC<DisplayHeadingProps> = ({
	variant = DisplayVariant.Section,
	className,
	render,
	...props
}) => {
	return useRender({
		defaultTagName: "h2",
		props: mergeProps<"h2">(
			{ className: cn(displayVariants({ variant }), className) },
			props,
		),
		render,
	});
};

export default DisplayHeading;
