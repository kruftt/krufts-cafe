import { cn } from "@lib/utils";
import { Button } from "@ui/button";
import { Spinner } from "@ui/spinner";

interface Props extends React.ComponentProps<"div"> {
	form?: string;
	requesting?: boolean;
	error?: string;
}

export function SubmitButton({ className, error, form, requesting }: Props) {
	return (
		<div className={cn("flex flex-col gap-4", className)}>
			<Button type="submit" form={form} className="w-1/1">
				{requesting ? (
					<div className="flex items-center gap-2">
						<Spinner />
						Creating Account...
					</div>
				) : (
					"Submit"
				)}
			</Button>
			{error && (
				<div
					role="alert"
					className="text-base text-center font-normal text-destructive"
				>
					{error}
				</div>
			)}
		</div>
	);
}
