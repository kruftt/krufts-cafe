import { Button } from "@components/ui/button";
import { Spinner } from "@components/ui/spinner";
import { cn } from "@lib/utils";

interface Props extends React.ComponentProps<"button"> {
	form?: string;
	request: { inProgress: boolean; error: string };
}

export function SubmitButton({ children, className, form, request }: Props) {
	return (
		<div className={cn("flex flex-col gap-4", className)}>
			<Button
				type="submit"
				form={form}
				className="w-1/1"
				disabled={request.inProgress}
				variant="outline"
			>
				<div className="flex items-center gap-2">
					{request.inProgress && <Spinner />}
					{children}
				</div>
			</Button>
			{request.error && (
				<div
					role="alert"
					className="text-base text-center font-normal text-destructive"
				>
					{request.error}
				</div>
			)}
		</div>
	);
}
