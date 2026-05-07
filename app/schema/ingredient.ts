import * as z from 'zod'

export const Model = z.object({
  id: z.int(),
  userId: z.string(),
  amount: z.number(),
  units: z.string(),
  name: z.string().min(1),
  description: z.string(),
  index: z.int(),
  sectionId: z.int(),
});

export const Create = Model.omit({ id: true, userId: true });

export const Partial = Model.partial({
	userId: true,
	amount: true,
	units: true,
	name: true,
	description: true,
	index: true,
	sectionId: true,
});

export type Model = z.infer<typeof Model>;
export type Partial = z.infer<typeof Partial>;
export type Create = z.infer<typeof Create>;