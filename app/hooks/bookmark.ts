import { bookmarksAtom } from "@atoms/user";
import { useTRPC } from "@lib/trpc";
import { useMutation } from "@tanstack/react-query";
import { useAtom } from "jotai";

export function useBookmarks() {
	const trpc = useTRPC();
	const [bookmarks, setBookmarks] = useAtom(bookmarksAtom);

	const bookmarkCreateMutation = useMutation(trpc.bookmark.create.mutationOptions());
	const bookmarkDeleteMutation = useMutation(trpc.bookmark.delete.mutationOptions());

	function isBookmarked(id: number) {
		return bookmarks.has(id);
	}

	function toggleBookmark(id: number) {
		if (isBookmarked(id)) {
			bookmarkDeleteMutation.mutate(
				{ id },
				{
					onSuccess: () =>
						setBookmarks((prev) => {
							const next = new Set(prev);
							next.delete(id);
							return next;
						}),
				},
			);
		} else {
			bookmarkCreateMutation.mutate(
				{ id },
				{ onSuccess: () => setBookmarks((prev) => new Set(prev).add(id)) },
			);
		}
	}

	return { isBookmarked, toggleBookmark };
}
