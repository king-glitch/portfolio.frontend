import React from "react";

interface PreloaderContextValue {
	/** True once the first-load count finished; hero animations wait for it. */
	loaded: boolean;
	setLoaded: (loaded: boolean) => void;
}

const PreloaderContext = React.createContext<PreloaderContextValue | null>(
	null,
);

interface PreloaderProviderProps {
	children: React.ReactNode;
}

export const PreloaderProvider: React.FC<PreloaderProviderProps> = ({
	children,
}) => {
	const [loaded, setLoaded] = React.useState(false);
	const value = React.useMemo(() => ({ loaded, setLoaded }), [loaded]);
	return (
		<PreloaderContext.Provider value={value}>
			{children}
		</PreloaderContext.Provider>
	);
};

export function usePreloader(): PreloaderContextValue {
	const context = React.useContext(PreloaderContext);
	if (!context)
		throw new Error("usePreloader must be used inside PreloaderProvider");
	return context;
}

export default PreloaderProvider;
