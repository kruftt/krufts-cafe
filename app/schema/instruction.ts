import * as z from 'zod'

export const Model = z.object({
  id: z.number(),
  userId: z.string(),
  description: z.string(),
  stepId: z.number(),
});

export const Create = Model.omit({ id: true, userId: true });

export type Model = z.infer<typeof Model>;
export type Create = z.infer<typeof Create>;
