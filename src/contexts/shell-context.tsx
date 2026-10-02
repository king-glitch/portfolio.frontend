import React from "react";

interface ShellContextValue {
	menuOpen: boolean;
	setMenuOpen: (open: boolean) => void;
	terminalOpen: boolean;
	setTerminalOpen: (open: boolean) => void;
}

const ShellContext = React.createContext<ShellContextValue | null>(null);

interface ShellProviderProps {
	children: React.ReactNode;
}

export const ShellProvider: React.FC<ShellProviderProps> = ({ children }) => {
	const [menuOpen, setMenuOpen] = React.useState(false);
	const [terminalOpen, setTerminalOpen] = React.useState(false);
	const value = React.useMemo(
		() => ({ menuOpen, setMenuOpen, terminalOpen, setTerminalOpen }),
		[menuOpen, terminalOpen],
	);
	return (
		<ShellContext.Provider value={value}>{children}</ShellContext.Provider>
	);
};

export function useShell(): ShellContextValue {
	const context = React.useContext(ShellContext);
	if (!context) throw new Error("useShell must be used inside ShellProvider");
	return context;
}

export default ShellProvider;
