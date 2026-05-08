import * as z from 'zod'

export const Model = z.object({
  id: z.string(),
  name: z.string().min(1).max(16).regex(
      /^[A-Za-z0-9]+( [A-Za-z0-9]+)*$/,
      { error: "Name must contain only letters, numbers, or spaces." }
    ),
  handle: z.string(),
  email: z.email(),
  emailVerified: z.boolean(),
  image: z.string().optional().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const Create = Model.omit({ 
  id: true,
  emailVerified: true,
  image: true,
  createdAt: true,
  updatedAt: true,
  handle: true,
}).extend({
  password: z
    .string()
    .min(8)
    .max(24)
    .regex(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*()_\-+=[\]\\|;:'"`,.<>/?]).*$/,
      {
        error:
          "Password must contain an uppercase letter, a lowercase letter, a number, and a special character.",
      },
    ),
});

export const Partial = Model.partial({
  id: true,
  name: true,
  handle: true,
  email: true,
  emailVerified: true,
  image: true,
  createdAt: true,
  updatedAt: true,
});

export const Names = Model.omit({
  id: true,
  email: true,
  emailVerified: true,
  image: true,
  createdAt: true,
  updatedAt: true,
});

// export const Full = Model.extend({
//   handle: z.string()
// })


export type Model = z.infer<typeof Model>;
export type Create = z.infer<typeof Create>;
export type Partial = z.infer<typeof Partial>;
export type Names = z.infer<typeof Names>;
// export type Full = z.infer<typeof Full>;