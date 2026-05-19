import { buttonVariants } from "@components/ui/button";
import { auth } from "@lib/auth-client";
import { cn } from "@lib/utils";
import { SearchIcon } from "lucide-react";
import { BsCupHotFill } from "react-icons/bs";
import { Link, useLocation } from "react-router";
import { LoginPopover, UserMenu } from "./menu";

export function AppBar() {
	const { data: session, isPending } = auth.useSession();
	const isLoggedIn = !isPending && session !== null;
	const location = useLocation();
	const isHome = location.pathname === "/";

	return (
		<header
			className={cn(
				"relative z-10 w-1/1 h-16 flex justify-between items-center p-4 text-white shadow-[0_0_3px_3px_rgba(0,0,0,0.2)]",
				"bg-cafe-blue-1",
				"dark:bg-cafe-blue-1-d",
			)}
		>
			<Link
				to="/"
				className={`${buttonVariants()} h-11 rounded-2xl! drop-shadow-md/30`}
			>
				<BsCupHotFill className="w-6! h-6!" />
			</Link>
			{isHome ? (
				<h1 className="text-3xl font-bold text-white">Kruft's Cafe</h1>
			) : (
				<form
					method="get"
					action="/"
					className="flex items-center w-64 rounded-full bg-black/75 border border-white/20 px-3 py-1 gap-2"
				>
					<input
						name="q"
						type="text"
						placeholder="Search all recipes.."
						className="flex-1 bg-transparent outline-none text-white placeholder:text-white/50 text-sm"
					/>
					<button type="submit" className="text-white/70 hover:text-white">
						<SearchIcon size={16} />
					</button>
				</form>
			)}
			{isLoggedIn ? <UserMenu user={session.user} /> : <LoginPopover />}
		</header>
	);
}
