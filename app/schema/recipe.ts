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
	published: z.boolean(),
	duration: z.int(),
	description: z.string(),
	intro: z.string(),
	userId: z.string(),
});

export const Partial = Model.partial({
	name: true,
	tags: true,
	slug: true,
	published: true,
	duration: true,
	description: true,
	intro: true,
	userId: true,
})

export const WithUser = Model.extend({
	user: z.object({
		handle: z.string(),
		name: z.string(),
	})
})

export const Full = Model.extend({
	user: z.object({
		name: z.string()
	}),
	sections: z.array(Section.Full),
});

export type Model = z.infer<typeof Model>;
export type Partial = z.infer<typeof Partial>;
export type WithUser = z.infer<typeof WithUser>;
export type Full = z.infer<typeof Full>;
