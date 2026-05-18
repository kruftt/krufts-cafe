import * as z from "zod";

export const Name = z
	.string()
	.min(1)
	.max(64)
	.regex(/^[\p{L}\p{N} '\-&,]+$/u, { error: "Invalid characters." });


export type Update = z.infer<typeof Update>;
export const Update = z.object({
	name: Name.optional(),
	tags: z.array(z.string()).optional(),
	published: z.boolean().optional(),
	prepTime: z.int().optional(),
	cookTime: z.int().optional(),
	intro: z.string().optional(),
});
