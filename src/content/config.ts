import { defineCollection, z } from "astro:content";

const archivesCollection = defineCollection({
	schema: z.object({
		title: z.string(),
		author: z.string().optional(),
		date: z.date(),
		updated: z.date().optional(),
		draft: z.boolean().optional().default(false),
		description: z.string().nullable().optional().default(""),
		image: z.string().nullable().optional().default(""),
		tags: z.array(z.string()).optional().default([]),
		categories: z.array(z.string()).optional().default([]),
		lang: z.string().optional().default(""),

		/* For internal use */
		prevTitle: z.string().default(""),
		prevSlug: z.string().default(""),
		nextTitle: z.string().default(""),
		nextSlug: z.string().default(""),
	}),
});
const specCollection = defineCollection({
	schema: z.object({}),
});
export const collections = {
	archives: archivesCollection,
	spec: specCollection,
};
