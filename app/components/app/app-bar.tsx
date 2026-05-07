import { auth } from "@lib/auth-client";
import { cn } from "@lib/utils";
import { buttonVariants } from "@ui/button";
import { BsCupHotFill } from "react-icons/bs";
import { LoginPopover, UserMenu } from "../user";

export function AppBar() {
	const { data: session, isPending } = auth.useSession();
	const isLoggedIn = !isPending && session !== null;

	return (
		<header
			className={cn(
				"w-1/1 h-16 flex justify-between items-center p-4 text-white drop-shadow-md/30",
				"bg-cafe-blue-1",
				"dark:bg-cafe-blue-1-d",
			)}
		>
			<a
				href="/"
				className={`${buttonVariants()} h-11 rounded-2xl! drop-shadow-md/30`}
			>
				<BsCupHotFill className="w-6! h-6!" />
			</a>
			<h1 className="text-3xl font-bold text-white">Kruft's Cafe</h1>
			{isLoggedIn ? <UserMenu name={session.user.name} /> : <LoginPopover />}
		</header>
	);
}
