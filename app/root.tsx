import AppBar from "@components/app-bar";
import { themeAtom } from "@state/atoms/theme";
import { Button } from "@ui/button";
import { useAtom } from "jotai";
import { BsMoonStarsFill, BsSunFill } from "react-icons/bs";
import { Outlet, Scripts } from "react-router";
import "./globals.css";
import { IconContext } from "react-icons";

export function Layout({ children }: React.PropsWithChildren) {
	return (
		<html lang="en">
			<head>
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="icon" href="data:image/x-icon;base64,AA" />
			</head>
			{children}
		</html>
	);
}

export default function App() {
	const [theme, setTheme] = useAtom(themeAtom);

	return (
		<body
			className={`
			${theme && "dark"} 
			bg-cafe-blue-3 text-black 
			dark:bg-cafe-blue-3-dark dark:text-white`}
		>
			<IconContext.Provider value={{ color: "black" }}>
				<AppBar />
				inside App function
			</IconContext.Provider>
			<Outlet />
			<Button className="absolute bottom-4 left-4 rounded-full" onClick={() => setTheme(!theme)}>
				{theme ? <BsSunFill /> : <BsMoonStarsFill />}
			</Button>
			<Scripts />
		</body>
	);
}

export function ErrorBoundary() {}
