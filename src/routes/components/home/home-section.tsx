import React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { HomePad } from "@/types/home";

const sectionVariants = cva("mx-auto max-w-340 px-[clamp(16px,4vw,48px)]", {
	variants: {
		pad: {
			[HomePad.Top]: "pt-[clamp(96px,12vw,180px)]",
			[HomePad.Bottom]: "pb-[clamp(96px,12vw,180px)]",
			[HomePad.Both]: "py-[clamp(96px,12vw,180px)]",
		},
	},
});

interface HomeSectionProps extends Omit<React.ComponentProps<"section">, "id"> {
	/** Anchor id from `config.sections`. */
	id: string;
	pad: HomePad;
}

/** Centred 1360px column shared by the home sections. */
export const HomeSection: React.FC<HomeSectionProps> = ({
	pad,
	className,
	...props
}) => {
	return (
		<section
			className={cn(sectionVariants({ pad }), className)}
			{...props}
		/>
	);
};

export default HomeSection;
