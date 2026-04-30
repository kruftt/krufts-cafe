import * as z from "zod";
import * as Section from "./section";

export const Model = z.object({
	id: z.int(),
	name: z.string().min(1),
	slug: z.string(),
	description: z.string(),
	userId: z.string(),
});

export const Create = Model.omit({ id: true, slug: true, userId: true });

export const Full = Model.extend({
	sections: z.array(Section.Full),
});

export type Model = z.infer<typeof Model>;
export type Create = z.infer<typeof Create>;
export type Full = z.infer<typeof Full>;
