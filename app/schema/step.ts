import { Ingredient, Instruction } from '@schema';
import * as z from 'zod'

export const Model = z.object({
  id: z.int(),
  userId: z.string(),
  name: z.string(),
  description: z.string(),
  index: z.int(),
  recipeId: z.int(),
});

export const Create = Model.omit({ id: true, userId: true });


export const Full = Model.extend({
	instructions: z.array(Instruction.Model),
	ingredients: z.array(Ingredient.Model),
});


export type Model = z.infer<typeof Model>;
export type Create = z.infer<typeof Create>;
export type Full = z.infer<typeof Full>