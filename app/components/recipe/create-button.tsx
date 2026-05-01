import { useTRPC } from "@lib/trpc";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@ui/button";
import { useNavigate } from "react-router";

export default function CreateButton() {
	const trpc = useTRPC();
	const createRecipe = useMutation(trpc.recipe.create.mutationOptions());
  const navigate = useNavigate();

	function submit() {
		createRecipe.mutate(undefined,
			{
				onSuccess: (data) => {
          navigate(`/my-recipes/${data.id}`)
        },
			},
		);
	}

	return (
    <Button onClick={submit}>
      New Recipe
    </Button>
	);
}
