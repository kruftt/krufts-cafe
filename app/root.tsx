import { themeAtom } from "@atoms/theme";
import { AppBar } from "@components/app";
import { Button } from "@ui/button";
import { useAtom } from "jotai";
import { BsMoonStarsFill, BsSunFill } from "react-icons/bs";
import { Outlet, Scripts } from "react-router";
import "./globals.css";
import { TRPCProvider } from "@lib/trpc";
import { cn } from "@lib/utils";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { useState } from "react";
import { IconContext } from "react-icons";
import type { TRPCRouter } from "./trpc/router";

function makeQueryClient() {
	return new QueryClient({
		defaultOptions: {
			queries: { staleTime: 60 * 1000 },
		},
	});
}

let browserQueryClient: QueryClient | undefined;

function getQueryClient() {
	if (typeof window === "undefined") {
		return makeQueryClient();
	} else {
		if (!browserQueryClient) browserQueryClient = makeQueryClient();

		return browserQueryClient;
	}
}

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
	const queryClient = getQueryClient();
	const [trpcClient] = useState(() =>
		createTRPCClient<TRPCRouter>({
			links: [
				httpBatchLink({
					url: "/api/trpc",
					// url: "http://localhost:5173",
				}),
			],
		}),
	);

	return (
		<QueryClientProvider client={queryClient}>
			<TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
				<IconContext.Provider value={{ color: `${theme ? "black" : "white"}` }}>
					<body
						className={cn(
							theme ? "dark" : "",
							"bg-cafe-blue-3 text-black",
							"dark:bg-cafe-blue-3-dark dark:text-white",
						)}
					>
						<AppBar />
						<Outlet />
						<Button
							className="fixed bottom-4 left-4 rounded-full"
							onClick={() => setTheme(!theme)}
						>
							{theme ? <BsSunFill /> : <BsMoonStarsFill />}
						</Button>
						<Scripts />
					</body>
				</IconContext.Provider>
			</TRPCProvider>
		</QueryClientProvider>
	);
}

export function ErrorBoundary() {}
