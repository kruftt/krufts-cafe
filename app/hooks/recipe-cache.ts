import { useTRPC, useTRPCClient } from "@lib/trpc";
import {
	Ingredient,
	IngredientGroup,
	Instruction,
	type Model,
	Recipe,
	Step,
} from "@schema";
import type {
	IngredientData,
	IngredientGroupData,
	InstructionData,
	RecipeData,
	StepData,
} from "@services/recipe";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createContext } from "react";
import type { ProcedureOptions } from "./editor";

export const RecipeIdContext = createContext<number>(0);

export function recipeQueryKey(recipeId: number) {
	return ["recipe", recipeId] as const;
}

export function useRecipeCache(recipeId: number) {
	const trpc = useTRPC();
	const trpcClient = useTRPCClient();
	const queryClient = useQueryClient();
	const queryKey = recipeQueryKey(recipeId);

	function updateCache(updater: (old: RecipeData) => RecipeData) {
		queryClient.setQueryData<RecipeData>(queryKey, (old) => {
			if (!old) return old;
			return updater(old);
		});
	}

	async function cancelAndSnapshot() {
		await queryClient.cancelQueries({ queryKey });
		return queryClient.getQueryData<RecipeData>(queryKey);
	}

	function restore(previous: RecipeData | undefined) {
		queryClient.setQueryData(queryKey, previous);
	}

	// Recipe
	const updateRecipe = useMutation({
		...trpc.recipe.update.mutationOptions(),
		onSuccess: (updated) => {
			updateCache((old) => ({ ...old, ...updated }));
		},
	});

	function updateRecipeField(id: number, field: keyof Recipe.Update) {
		return (value: string, options: ProcedureOptions) => {
			const v = field.includes("Time") ? parseInt(value, 10) : value;

			const result = Recipe.Update.shape[field].safeParse(v);
			if (result.success) {
				updateRecipe.mutate({ id, [field]: v }, options);
			} else {
				if (result.error.issues[0]) options.onError(result.error.issues[0]);
			}
		};
	}

	// Ingredient Groups
	const addIngredientGroup = useMutation({
		...trpc.ingredientGroup.create.mutationOptions(),
		onSuccess: (group) => {
			updateCache((old) => ({
				...old,
				ingredientGroups: [
					...old.ingredientGroups,
					{ ...group, ingredients: [] },
				],
			}));
		},
	});

	const updateIngredientGroup = useMutation({
		...trpc.ingredientGroup.update.mutationOptions(),
		onSuccess: (updated) => {
			updateCache((old) => ({
				...old,
				ingredientGroups: old.ingredientGroups.map((g) =>
					g.id === updated.id ? { ...g, ...updated } : g,
				),
			}));
		},
	});

	const removeIngredientGroup = useMutation<
		Omit<IngredientGroupData, "ingredients">,
		Error,
		Model.Id,
		{ previous: RecipeData | undefined }
	>({
		mutationFn: (vars) => trpcClient.ingredientGroup.delete.mutate(vars),
		onMutate: async ({ id }) => {
			const previous = await cancelAndSnapshot();
			updateCache((old) => ({
				...old,
				ingredientGroups: old.ingredientGroups.filter((g) => g.id !== id),
			}));
			return { previous };
		},
		onError: (_err, _vars, ctx) => restore(ctx?.previous),
	});

	function updateIngredientGroupField(
		id: number,
		field: keyof IngredientGroup.Update,
	) {
		return (value: string, options: ProcedureOptions) => {
			const result = IngredientGroup.Update.shape[field].safeParse(value);
			if (result.success) {
				updateIngredientGroup.mutate({ id, [field]: value }, options);
			} else {
				if (result.error.issues[0]) options.onError(result.error.issues[0]);
			}
		};
	}

	// Ingredients
	const addIngredient = useMutation({
		...trpc.ingredient.create.mutationOptions(),
		onSuccess: (ingredient) => {
			updateCache((old) => ({
				...old,
				ingredientGroups: old.ingredientGroups.map((g) =>
					g.id === ingredient.groupId
						? { ...g, ingredients: [...g.ingredients, ingredient] }
						: g,
				),
			}));
		},
	});

	const updateIngredient = useMutation({
		...trpc.ingredient.update.mutationOptions(),
		onSuccess: (updated) => {
			updateCache((old) => ({
				...old,
				ingredientGroups: old.ingredientGroups.map((g) => ({
					...g,
					ingredients: g.ingredients.map((i) =>
						i.id === updated.id ? { ...i, ...updated } : i,
					),
				})),
			}));
		},
	});

	const removeIngredient = useMutation<
		IngredientData,
		Error,
		Model.Id,
		{ previous: RecipeData | undefined }
	>({
		mutationFn: (vars) => trpcClient.ingredient.delete.mutate(vars),
		onMutate: async ({ id }) => {
			const previous = await cancelAndSnapshot();
			updateCache((old) => ({
				...old,
				ingredientGroups: old.ingredientGroups.map((g) => ({
					...g,
					ingredients: g.ingredients.filter((i) => i.id !== id),
				})),
			}));
			return { previous };
		},
		onError: (_err, _vars, ctx) => restore(ctx?.previous),
	});

	function updateIngredientField(id: number, field: keyof Ingredient.Update) {
		return (value: string, options: ProcedureOptions) => {
			const v = field === "amount" ? parseFloat(value) : value;

			const result = Ingredient.Update.shape[field].safeParse(v);
			if (result.success) {
				updateIngredient.mutate({ id, [field]: v }, options);
			} else {
				if (result.error.issues[0]) options.onError(result.error.issues[0]);
			}
		};
	}

	// Steps
	const addStep = useMutation({
		...trpc.step.create.mutationOptions(),
		onSuccess: (step) => {
			updateCache((old) => ({
				...old,
				steps: [...old.steps, { ...step, instructions: [] }],
			}));
		},
	});

	const updateStep = useMutation({
		...trpc.step.update.mutationOptions(),
		onSuccess: (updated) => {
			updateCache((old) => ({
				...old,
				steps: old.steps.map((s) =>
					s.id === updated.id ? { ...s, ...updated } : s,
				),
			}));
		},
	});

	const removeStep = useMutation<
		Omit<StepData, "instructions">,
		Error,
		Model.Id,
		{ previous: RecipeData | undefined }
	>({
		mutationFn: (vars) => trpcClient.step.delete.mutate(vars),
		onMutate: async ({ id }) => {
			const previous = await cancelAndSnapshot();
			updateCache((old) => ({
				...old,
				steps: old.steps.filter((s) => s.id !== id),
			}));
			return { previous };
		},
		onError: (_err, _vars, ctx) => restore(ctx?.previous),
	});

	function updateStepField(id: number, field: keyof Step.Update) {
		return (value: string, options: ProcedureOptions) => {
			const result = Step.Update.shape[field].safeParse(value);
			if (result.success) {
				updateStep.mutate({ id, [field]: value }, options);
			} else {
				if (result.error.issues[0]) options.onError(result.error.issues[0]);
			}
		};
	}

	// Instructions
	const addInstruction = useMutation({
		...trpc.instruction.create.mutationOptions(),
		onSuccess: (instruction) => {
			updateCache((old) => ({
				...old,
				steps: old.steps.map((s) =>
					s.id === instruction.stepId
						? { ...s, instructions: [...s.instructions, instruction] }
						: s,
				),
			}));
		},
	});

	const updateInstruction = useMutation({
		...trpc.instruction.update.mutationOptions(),
		onSuccess: (updated) => {
			updateCache((old) => ({
				...old,
				steps: old.steps.map((s) => ({
					...s,
					instructions: s.instructions.map((i) =>
						i.id === updated.id ? { ...i, ...updated } : i,
					),
				})),
			}));
		},
	});

	const removeInstruction = useMutation<
		InstructionData,
		Error,
		Model.Id,
		{ previous: RecipeData | undefined }
	>({
		mutationFn: (vars) => trpcClient.instruction.delete.mutate(vars),
		onMutate: async ({ id }) => {
			const previous = await cancelAndSnapshot();
			updateCache((old) => ({
				...old,
				steps: old.steps.map((s) => ({
					...s,
					instructions: s.instructions.filter((i) => i.id !== id),
				})),
			}));
			return { previous };
		},
		onError: (_err, _vars, ctx) => restore(ctx?.previous),
	});

	function updateInstructionField(id: number, field: keyof Instruction.Update) {
		return (value: string, options: ProcedureOptions) => {
			const result = Instruction.Update.shape[field].safeParse(value);
			if (result.success) {
				updateInstruction.mutate({ id, [field]: value }, options);
			} else {
				if (result.error.issues[0]) options.onError(result.error.issues[0]);
			}
		};
	}

	return {
		updateRecipe,
		updateRecipeField,
		addIngredientGroup,
		// updateIngredientGroup,
		updateIngredientGroupField,
		removeIngredientGroup,
		addIngredient,
		// updateIngredient,
		updateIngredientField,
		removeIngredient,
		addStep,
		// updateStep,
		updateStepField,
		removeStep,
		addInstruction,
		// updateInstruction,
		updateInstructionField,
		removeInstruction,
	};
}
