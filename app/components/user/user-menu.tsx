import { auth } from "@lib/auth-client";
import type { User } from "@schema";
import { Button } from "@ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	// DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@ui/dropdown-menu";
import { useNavigate } from "react-router";

export function UserMenu({ user }: { user: User.Model }) {
	const navigate = useNavigate();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger render={<Button className="drop-shadow-md/30" />}>
				{user.name}
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuGroup>
					<DropdownMenuItem onClick={() => navigate('/my-recipes/')}>My Recipes</DropdownMenuItem>
					<DropdownMenuItem>Bookmarks</DropdownMenuItem>
					{/* <DropdownMenuItem>Meal Plans</DropdownMenuItem> */}
					<DropdownMenuItem onClick={() => navigate(`/profile/`)}>Profile</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem
						variant="destructive"
						onClick={() => {
							auth.signOut();
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
