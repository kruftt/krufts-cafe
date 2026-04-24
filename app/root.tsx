import AppBar from "@components/app-bar";
import { themeAtom } from "@state/atoms/theme";
import { useAtomValue } from "jotai";
import { Outlet, Scripts } from "react-router";
import "./root.css";

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
	const theme = useAtomValue(themeAtom);

	return (
		<body
			className={`
			${theme && "dark"} 
			bg-cafe-blue-3 text-black 
			dark:bg-cafe-blue-3-dark dark:text-white`}
		>
			<AppBar />
			inside App function
			<Outlet />
			<Scripts />
		</body>
	);
}

export function ErrorBoundary() {}
