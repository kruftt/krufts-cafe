import { pinnedRecipesAtom, pinsAtom } from "@atoms/user";
import { auth } from "@lib/auth-client";
import { useTRPC } from "@lib/trpc";
import { useMutation } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { useEffect } from "react";
import type { Route } from "../+types/root";

const LS_KEY = "pins";

type PinnedRecipe = Route.ComponentProps["loaderData"]["pinnedRecipes"][number];

function loadFromStorage(): PinnedRecipe[] {
	try {
		return JSON.parse(localStorage.getItem(LS_KEY) ?? "[]");
	} catch {
		return [];
	}
}

function saveToStorage(recipes: PinnedRecipe[]) {
	localStorage.setItem(LS_KEY, JSON.stringify(recipes));
}


export function usePins() {
	const { data: session } = auth.useSession();
	const isLoggedIn = !!session;
	const trpc = useTRPC();
	const [pins, setPins] = useAtom(pinsAtom);
	const [pinnedRecipes, setPinnedRecipes] = useAtom(pinnedRecipesAtom);

	const pinCreateMutation = useMutation(trpc.pin.create.mutationOptions());
	const pinDeleteMutation = useMutation(trpc.pin.delete.mutationOptions());

	// biome-ignore lint/correctness/useExhaustiveDependencies: intentionally only runs on login state change
	useEffect(() => {
		if (isLoggedIn) return;
		const stored = loadFromStorage();
		if (!stored.length) return;
		setPinnedRecipes(stored);
		setPins(new Set(stored.map((r) => r.id)));
	}, [isLoggedIn]);

	async function mergePins() {
		const stored = loadFromStorage();
		if (!stored.length) return;
		await Promise.all(stored.map((recipe) =>
			pinCreateMutation.mutateAsync({ id: recipe.id })
		));
		localStorage.removeItem(LS_KEY);
	}

	function isPinned(id: number) {
		return pins.has(id);
	}

	function togglePin(recipe: PinnedRecipe) {
		if (isPinned(recipe.id)) {
			if (isLoggedIn) {
				pinDeleteMutation.mutate({ id: recipe.id }, {
					onSuccess: () => {
						setPins((prev) => { const next = new Set(prev); next.delete(recipe.id); return next; });
						setPinnedRecipes((prev) => prev.filter((r) => r.id !== recipe.id));
					},
				});
			} else {
				const next = pinnedRecipes.filter((r) => r.id !== recipe.id);
				setPinnedRecipes(next);
				setPins((prev) => { const s = new Set(prev); s.delete(recipe.id); return s; });
				saveToStorage(next);
			}
		} else {
			if (isLoggedIn) {
				pinCreateMutation.mutate({ id: recipe.id }, {
					onSuccess: () => {
						setPins((prev) => new Set(prev).add(recipe.id));
						setPinnedRecipes((prev) => [...prev, recipe]);
					},
				});
			} else {
				const next = [...pinnedRecipes, recipe];
				setPinnedRecipes(next);
				setPins((prev) => new Set(prev).add(recipe.id));
				saveToStorage(next);
			}
		}
	}

  function clearPins() {
    setPins(new Set());
    setPinnedRecipes([]);
    localStorage.removeItem(LS_KEY);
  }

	return { isPinned, togglePin, pinnedRecipes, clearPins, mergePins };
}
