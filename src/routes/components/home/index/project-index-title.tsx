import React from "react";

const ROLL_STAGGER_MS = 16;

interface ProjectIndexTitleProps {
	name: string;
}

/** Row title whose letters roll up and are replaced by a copy when the parent `group/row` is hovered. */
export const ProjectIndexTitle: React.FC<ProjectIndexTitleProps> = ({
	name,
}) => {
	const words = name.split(" ").map((word, i, all) => ({
		word,
		// Letters before this word, so the stagger runs across the whole title.
		offset: all.slice(0, i).reduce((n, w) => n + w.length + 1, 0),
	}));
	return (
		<span aria-hidden="true" className="block">
			{words.map(({ word, offset }) => (
				<span
					key={offset}
					className="mr-[0.25em] inline-block whitespace-nowrap"
				>
					{[...word].map((char, i) => {
						const style = {
							transitionDelay: `${(offset + i) * ROLL_STAGGER_MS}ms`,
						};
						return (
							<span
								// ponytail: letters never reorder, position is the identity
								key={i}
								className="relative inline-block overflow-hidden py-[0.06em] align-bottom"
							>
								<span
									style={style}
									className="block transition-transform duration-600 ease-(--ease-out-expo) group-hover/row:-translate-y-full group-focus-visible/row:-translate-y-full"
								>
									{char}
								</span>
								<span
									style={style}
									className="absolute inset-x-0 top-full block py-[0.06em] transition-transform duration-600 ease-(--ease-out-expo) group-hover/row:-translate-y-full group-focus-visible/row:-translate-y-full"
								>
									{char}
								</span>
							</span>
						);
					})}
				</span>
			))}
		</span>
	);
};

export default ProjectIndexTitle;
