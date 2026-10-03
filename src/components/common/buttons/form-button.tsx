import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FormButtonProps extends React.ComponentProps<typeof Button> {}

/** shadcn `Button` at the medium size (44px, the `.tap` md height) used by every form action. */
export const FormButton: React.FC<FormButtonProps> = ({
	className,
	...props
}) => {
	return <Button className={cn("h-11 px-4", className)} {...props} />;
};

export default FormButton;
