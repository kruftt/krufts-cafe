import * as z from 'zod'

export const Model = z.object({
  id: z.int(),
  userId: z.string(),
  description: z.string(),
  index: z.int(),
  sectionId: z.int(),
});

export const Partial = Model.partial({
  userId: true,
  description: true,
  index: true,
  sectionId: true,
});

export const Create = Model.omit({ id: true, userId: true });

export type Model = z.infer<typeof Model>;
export type Create = z.infer<typeof Create>;
export type Partial = z.infer<typeof Partial>;
