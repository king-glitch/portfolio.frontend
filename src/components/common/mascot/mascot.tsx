import React, { useImperativeHandle, useRef } from "react";
import { useMascot } from "@/hooks/use-mascot";
import { cn } from "@/lib/utils";
import {
	MascotDesign,
	type MascotHandle,
	type MascotOptions,
} from "@/types/ui";

interface MascotProps {
	design?: MascotDesign;
	options?: Partial<MascotOptions>;
	className?: string;
	ref?: React.Ref<MascotHandle>;
}

/** Living mascot head (decorative): turns toward the cursor, blinks, squashes on clicks. Size it with `className`. */
export const Mascot: React.FC<MascotProps> = ({
	design = MascotDesign.Brackets,
	options,
	className,
	ref,
}) => {
	const rootRef = useRef<HTMLDivElement>(null);
	const headRef = useRef<HTMLDivElement>(null);
	const engine = useMascot(rootRef, headRef, design, options);
	useImperativeHandle(
		ref,
		() => ({
			poke: (strength) => engine.current?.poke(strength),
			setZone: (zone, range) => engine.current?.setZone(zone, range),
		}),
		[engine],
	);
	return (
		<div
			ref={rootRef}
			aria-hidden="true"
			className={cn("relative aspect-square shrink-0", className)}
		>
			<div ref={headRef} className="relative isolate size-full" />
		</div>
	);
};

export default Mascot;
