import { usePins } from "@hooks/pins";
import { auth } from "@lib/auth-client";
import type { User } from "@schema";
import { Button } from "@ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@ui/dropdown-menu";
import { useNavigate, useRevalidator } from "react-router";

export function UserMenu({ user }: { user: User.Model }) {
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
						<a href="/my-recipes/">My Recipes</a>
					</DropdownMenuItem>
					<DropdownMenuItem>
						<a href="/bookmarks/">Bookmarks</a>
					</DropdownMenuItem>
					<DropdownMenuItem>
						<a href="/profile/">Profile</a>
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
