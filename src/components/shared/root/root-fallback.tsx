import React from "react";

interface RootFallbackProps {}

/** First-load placeholder (React Router root `HydrateFallback`): the page background only; the preloader takes over at once. */
export const RootFallback: React.FC<RootFallbackProps> = () => {
	return <div className="min-h-svh bg-foreground" />;
};

export default RootFallback;
