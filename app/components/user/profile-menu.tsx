import { auth } from "@lib/auth-client";
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

export default function ProfileMenu({ name }: { name: string }) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger render={<Button className="drop-shadow-md/30" />}>
				{name}
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuGroup>
					<DropdownMenuItem>Favorites</DropdownMenuItem>
					<DropdownMenuItem>Recipes</DropdownMenuItem>
					<DropdownMenuItem>Meal Plans</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem
						variant="destructive"
						onClick={() => auth.signOut()}
					>
						Logout
					</DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
