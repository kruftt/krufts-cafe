import type { SessionUser } from "@lib/auth-client";
import { atom } from "jotai";
import type { Route } from "../+types/root";

export const pinsAtom = atom<Set<number>>(new Set<number>());
export const bookmarksAtom = atom<Set<number>>(new Set<number>());
export const pinnedRecipesAtom = atom<Route.ComponentProps["loaderData"]["pinnedRecipes"]>([]);
export const sessionUserAtom = atom<SessionUser | null>(null);