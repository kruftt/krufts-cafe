import { useTRPC } from "@lib/trpc";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@ui/button";
import { useNavigate, useRevalidator } from "react-router";

export default function CreateButton() {
	const trpc = useTRPC();
	const createRecipe = useMutation(trpc.recipe.create.mutationOptions());
	const navigate = useNavigate();

	const revalidator = useRevalidator();

	function submit() {
		createRecipe.mutate(undefined, {
			onSuccess: (data) => {
				navigate(`/edit/${data.id}`)
				// revalidator.revalidate();
			},
		});
	}

	return <Button onClick={submit}>New Recipe</Button>;
}
