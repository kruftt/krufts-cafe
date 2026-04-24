import { BsCupHotFill } from "react-icons/bs";
import AppButton from "./app-button";
import ProfileButton from "./profile-button"
import ThemeButton from "./theme-button"

export default function AppBar() {
	return (
		<header
			className={`
        w-1/1 h-16 flex justify-between items-center p-4 text-white drop-shadow-md/30 
        bg-cafe-blue-1
        dark:bg-cafe-blue-1-d
      `}
		>
			<AppButton>
				<a href="/">
					<BsCupHotFill className="w-10 h-10 p-2" />
				</a>
			</AppButton>
			<h1 className="text-3xl font-bold text-white">Kruft's Cafe</h1>
			<div className="flex gap-2">
				<AppButton>
          <ProfileButton />
        </AppButton>
				<AppButton>
          <ThemeButton />
        </AppButton>
			</div>
		</header>
	);
}
