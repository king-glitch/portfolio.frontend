import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface PostCalloutProps {
	text: string;
}

export const PostCallout: React.FC<PostCalloutProps> = ({ text }) => {
	return (
		<Alert role="note">
			<AlertDescription className="text-[15px] font-semibold text-foreground">
				{text}
			</AlertDescription>
		</Alert>
	);
};

export default PostCallout;
