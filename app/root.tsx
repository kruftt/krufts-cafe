import { themeAtom } from "@atoms/theme";
import { bookmarksAtom, pinnedRecipesAtom, pinsAtom } from "@atoms/user";
import { AppBar, PinnedRecipes } from "@components/app";
import { auth } from "@lib/auth-server";
import { prisma } from "@lib/prisma";
import { Button } from "@ui/button";
import { createStore, Provider, useAtom } from "jotai";
import { BsMoonStarsFill, BsSunFill } from "react-icons/bs";
import { Outlet, Scripts } from "react-router";
import "./globals.css";
import { TRPCProvider } from "@lib/trpc";
import { cn } from "@lib/utils";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { useMemo, useState } from "react";
import { IconContext } from "react-icons";
import type { Route } from "./+types/root";
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

export async function loader({ request }: Route.LoaderArgs) {
	const session = await auth.api.getSession({ headers: request.headers });
	if (!session) return { pins: [], bookmarks: [], pinnedRecipes: [] };

	const [pins, bookmarks] = await Promise.all([
		prisma.pin.findMany({
			where: { userId: session.user.id },
			include: {
				recipe: {
					select: {
						id: true,
						name: true,
						slug: true,
						user: { select: { handle: true } },
					},
				},
			},
		}),
		prisma.bookmark.findMany({
			where: { userId: session.user.id },
			select: { recipeId: true },
		}),
	]);

	return {
		pins: pins.map((p) => p.recipeId),
		pinnedRecipes: pins.map((p) => p.recipe),
		bookmarks: bookmarks.map((b) => b.recipeId),
	};
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

export default function App({ loaderData }: Route.ComponentProps) {
	const { pins, bookmarks, pinnedRecipes } = loaderData;
	
	const store = useMemo(() => {
		const s = createStore();
		s.set(pinsAtom, new Set<number>(pins));
		s.set(bookmarksAtom, new Set<number>(bookmarks));
		s.set(pinnedRecipesAtom, pinnedRecipes);
		return s;
	}, [pins, bookmarks, pinnedRecipes]);
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
		<Provider store={store}>
			<QueryClientProvider client={queryClient}>
				<TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
					<IconContext.Provider
						value={{ color: `${theme ? "black" : "white"}` }}
					>
						<body
							className={cn(
								theme ? "dark" : "",
								"bg-cafe-blue-3 text-black",
								"dark:bg-cafe-blue-3-dark dark:text-white",
							)}
						>
							<AppBar />
							<PinnedRecipes />
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
		</Provider>
	);
}

export function ErrorBoundary() {}
