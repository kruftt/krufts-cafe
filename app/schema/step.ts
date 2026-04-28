import { Ingredient, Instruction } from '@schema';
import * as z from 'zod'

export const Model = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  recipeId: z.number(),
});

export const Create = Model.omit({ id: true, recipeId: true }).extend({
  ingredients: z.array(Ingredient.Create),
  instructions: z.array(Instruction.Create),
});


export const Update = Model.partial();


export const WithInstructions = Model.extend({
	instructions: z.array(Instruction.Model),
});


export type Model = z.infer<typeof Model>;
export type Create = z.infer<typeof Create>;
export type Update = z.infer<typeof Update>;
export type WithInstructions = z.infer<typeof WithInstructions>