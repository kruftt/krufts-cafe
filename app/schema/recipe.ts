import { Section } from "@schema";
import * as z from "zod";

export const Model = z.object({
	id: z.int(),
	name: z.string().min(1),
	description: z.string(),
	userId: z.string(),
});

export const Create = Model.omit({ id: true, userId: true });

export const Full = Model.extend({
	sections: z.array(Section.Full),
});


export type Model = z.infer<typeof Model>;
export type Create = z.infer<typeof Create>;
export type Full = z.infer<typeof Full>;
