import {
	buildPostMarkdown,
	createMarkdownResponse,
} from "@utils/agent-readiness";
import { getSortedPosts, type SortedPost } from "@utils/content-utils";
import type { APIRoute, GetStaticPaths } from "astro";

export const getStaticPaths = (async () => {
	const entries = await getSortedPosts();
	return entries.map((entry) => ({
		params: { slug: entry.slug },
		props: { entry },
	}));
}) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ props, site }) => {
	const entry = (props as { entry?: SortedPost }).entry;
	if (!entry) {
		return new Response("Not found", { status: 404 });
	}

	const markdown = buildPostMarkdown(
		entry,
		site?.toString() ?? import.meta.env.SITE,
	);

	return createMarkdownResponse(markdown);
};
