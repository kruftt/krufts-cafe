import * as z from 'zod'

export const Id = z.object({ id: z.int() });
export type Id = z.infer<typeof Id>;

export const Index = Id.extend({ index: z.int() });
export type Index = z.infer<typeof Id>;

export const Indices = z.array(Index);
export type Indices = z.infer<typeof Indices>;
