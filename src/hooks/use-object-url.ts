import { useEffect, useState } from "react";

/** Blob URL of a local file for previews; revoked when the file changes or the component unmounts. */
export function useObjectUrl(file: File | undefined): string | undefined {
	const [url, setUrl] = useState<string>();
	useEffect(() => {
		if (!file) return;
		const next = URL.createObjectURL(file);
		setUrl(next);
		return () => {
			URL.revokeObjectURL(next);
			setUrl(undefined);
		};
	}, [file]);
	return file ? url : undefined;
}
