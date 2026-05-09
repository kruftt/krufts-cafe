import { usePins } from "@hooks/pins";
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
					<DropdownMenuItem onClick={() => navigate("/my-recipes/")}>
						My Recipes
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => navigate("/bookmarks/")}>
						Bookmarks
					</DropdownMenuItem>
					{/* <DropdownMenuItem>Meal Plans</DropdownMenuItem> */}
					<DropdownMenuItem onClick={() => navigate(`/profile/`)}>
						Profile
					</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem
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
