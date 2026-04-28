import { Step } from "@schema";
import * as z from "zod";

export const Model = z.object({
	id: z.number(),
	name: z.string(),
	description: z.string(),
	authorId: z.number(),
});

export const Create = Model.omit({ id: true }).extend({
	steps: z.array(Step.Create),
});

export const WithSteps = Model.extend({
	steps: z.array(Step.WithInstructions),
});

export const Update = Create.extend({ id: z.number() });

export type Model = z.infer<typeof Model>;
export type Create = z.infer<typeof Create>;
export type Update = z.infer<typeof Update>;
