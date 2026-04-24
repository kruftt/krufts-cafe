import { themeAtom } from "@state/atoms/theme";
import { useAtom } from "jotai";
import { BsMoonStarsFill, BsSunFill } from "react-icons/bs";

export default function ThemeButton() {
	const [theme, setTheme] = useAtom(themeAtom);

	return (
		<button type="button" className="p-2" onClick={() => setTheme(!theme)}>
			{theme ? <BsMoonStarsFill /> : <BsSunFill />}
		</button>
	);
}
