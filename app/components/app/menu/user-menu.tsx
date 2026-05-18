import { Button } from "@components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import { usePins } from "@hooks/pins";
import { auth, type SessionUser } from "@lib/auth-client";
import { useNavigate, useRevalidator } from "react-router";

export function UserMenu({ user }: { user: SessionUser }) {
	const navigate = useNavigate();
	const revalidator = useRevalidator();
	const { clearPins } = usePins();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger render={<Button className="drop-shadow-md/30" />}>
				{user.name}
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuGroup>
					<DropdownMenuItem>
						<a className="w-1/1" href="/my-recipes/">My Recipes</a>
					</DropdownMenuItem>
					<DropdownMenuItem>
						<a className="w-1/1" href="/bookmarks/">Bookmarks</a>
					</DropdownMenuItem>
					<DropdownMenuItem>
						<a className="w-1/1" href="/profile/">Profile</a>
					</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem
						className="cursor-pointer"
						variant="destructive"
						onClick={() => {
							auth.signOut({
								fetchOptions: {
									onSuccess: () => {
										clearPins();
										revalidator.revalidate();
									},
								},
							});
							navigate("/");
						}}
					>
						Logout
					</DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
