import { Button } from "@ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@ui/popover";
import CreationForm from "./creation-form";
import LoginForm from "./login-form";

export default function LoginPopover() {
	return (
		<Popover>
			<PopoverTrigger render={<Button className="drop-shadow-md/30" />}>
				login
			</PopoverTrigger>
			<PopoverContent>
				<LoginForm />
				<CreationForm />
			</PopoverContent>
		</Popover>
	);
}
