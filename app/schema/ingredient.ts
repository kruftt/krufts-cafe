import * as z from 'zod'

export const Model = z.object({
  id: z.int(),
  userId: z.string(),
  amount: z.number(),
  units: z.string(),
  name: z.string().min(1),
  description: z.string(),
  index: z.int(),
  stepId: z.int(),
});

export const Create = Model.omit({ id: true, userId: true });

export type Model = z.infer<typeof Model>;
export type Create = z.infer<typeof Create>;