import { defineCollection } from "astro:content";
import type { CollectionConfig } from "astro/content/config";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const archivesCollection = defineCollection({
	loader: glob({
		base: "./src/content/archives",
		pattern: "**/*.md",
	}),
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
		references: z
			.array(
				z.object({
					title: z.string(),
					url: z.string(),
				}),
			)
			.optional()
			.default([]),
	}),
});

const specCollection = defineCollection({
	loader: glob({
		base: "./src/content/spec",
		pattern: "**/*.md",
	}),
	schema: z.object({}),
});

export const collections: Record<string, CollectionConfig<any>> = {
	archives: archivesCollection,
	spec: specCollection,
};
