import * as z from "zod";
import * as Section from "./section";

export const Name = z
	.string()
	.min(1)
	.max(64)
	.regex(/^\P{Cc}+$/u, { error: "Invalid characters." });

export const Model = z.object({
	id: z.int(),
	name: Name,
	slug: z.string().nullable(),
	description: z.string(),
	userId: z.string(),
});

export const Full = Model.extend({
	sections: z.array(Section.Full),
});

export type Model = z.infer<typeof Model>;
export type Full = z.infer<typeof Full>;
