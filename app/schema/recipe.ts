import * as z from "zod";
import * as Section from "./section";

export const Name = z
	.string()
	.min(1)
	.max(64)
	.regex(/^[\p{L}\p{N} '\-&,]+$/u, { error: "Invalid characters." });

export const Model = z.object({
	id: z.int(),
	name: Name,
	tags: z.array(z.string()),
	slug: z.string().nullable(),
	description: z.string(),
	intro: z.string(),
	userId: z.string(),
});

export const Partial = Model.partial({
	name: true,
	tags: true,
	slug: true,
	description: true,
	intro: true,
	userId: true,
})

export const WithHandle = Model.extend({
	user: z.object({
		handle: z.string()
	})
})

export const Full = Model.extend({
	sections: z.array(Section.Full),
});

export type Model = z.infer<typeof Model>;
export type Partial = z.infer<typeof Partial>;
export type WithHandle = z.infer<typeof WithHandle>;
export type Full = z.infer<typeof Full>;
