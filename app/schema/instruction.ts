import * as z from 'zod'

export type Create = z.infer<typeof Create>;
export const Create = z.object({
  stepId: z.int(),
  index: z.int(),
});

export type Update = z.infer<typeof Update>;
export const Update = z.object({
  text: z.string().optional(),
});

