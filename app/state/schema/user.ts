import * as z from 'zod'

export const Model = z.object({
  id: z.number(),
  email: z.string().email(),
  name: z.string(),
});


export const Create = Model.omit({ id: true });


export const Update = Model.partial();


export type Model = z.infer<typeof Model>;
export type Create = z.infer<typeof Create>;
export type Update = z.infer<typeof Update>;
