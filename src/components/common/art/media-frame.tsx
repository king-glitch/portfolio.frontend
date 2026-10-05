import React, { useRef } from "react";
import { cva } from "class-variance-authority";
import type { MediaAsset } from "@/api/types/portfolio/block";
import { MediaFit, MediaTone } from "@/api/types/portfolio/enums";
import { useCoarsePointer } from "@/hooks/physics/use-coarse-pointer";
import { useInView } from "@/hooks/physics/use-in-view";
import { config } from "@/config";
import { cn } from "@/lib/utils";

const frameVariants = cva("group/media relative block", {
	variants: {
		fit: {
			[MediaFit.Cover]: "overflow-hidden rounded-xl bg-muted",
			[MediaFit.Contain]: "",
		},
	},
});

// Monochrome until hovered (or, on touch, until centred); the colour eases in.
const imageVariants = cva(
	"block size-full grayscale transition-[filter] duration-700 ease-out group-hover/media:grayscale-0 group-data-active/media:grayscale-0 motion-reduce:transition-none",
	{
		variants: {
			fit: {
				// Oversized so the parallax shift (clamped by the scroller) never shows an edge.
				[MediaFit.Cover]: "scale-112 object-cover",
				[MediaFit.Contain]:
					"object-contain drop-shadow-[0_30px_40px_rgb(0_0_0/0.28)]",
			},
			tone: {
				[MediaTone.Photo]: "contrast-[1.06] dark:brightness-90",
				[MediaTone.Ui]: "contrast-[1.04] dark:brightness-90",
				// Flat single-colour art reads as ink: inverted on the dark theme, restored on hover.
				[MediaTone.Ink]:
					"group-hover/media:invert-0 group-data-active/media:invert-0 dark:invert",
			},
		},
	},
);

interface MediaFrameProps {
	asset: MediaAsset;
	className?: string;
}

/**
 * One project image: monochrome by default, full colour on hover. `cover` images sit in a clipped
 * frame and carry the scroller's parallax layer (`data-speed`), so they move inside their own box
 * and never across a neighbour; `contain` cut-outs float on the panel without a frame.
 */
export const MediaFrame: React.FC<MediaFrameProps> = ({ asset, className }) => {
	const ref = useRef<HTMLDivElement>(null);
	const coarse = useCoarsePointer();
	const centred = useInView(ref, config.work.media.activeBand);
	const ratio =
		asset.width && asset.height
			? `${asset.width} / ${asset.height}`
			: config.work.media.fallbackRatio;
	return (
		<div
			ref={ref}
			data-active={coarse && centred ? "" : undefined}
			style={{ aspectRatio: ratio }}
			className={cn(frameVariants({ fit: asset.fit }), className)}
		>
			<img
				src={asset.url}
				alt={asset.alt}
				width={asset.width}
				height={asset.height}
				loading="lazy"
				decoding="async"
				draggable={false}
				data-speed={
					asset.fit === MediaFit.Cover
						? config.work.media.parallaxSpeed
						: undefined
				}
				className={imageVariants({ fit: asset.fit, tone: asset.tone })}
			/>
		</div>
	);
};

export default MediaFrame;
