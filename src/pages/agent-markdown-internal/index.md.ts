import { siteConfig } from "@/config";
import {
	buildIndexMarkdown,
	createMarkdownResponse,
} from "@utils/agent-readiness";
import { getSortedPostsList } from "@utils/content-utils";
import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ site }) => {
	const posts = await getSortedPostsList();
	const markdown = buildIndexMarkdown(
		siteConfig.title,
		siteConfig.subtitle,
		posts,
		site?.toString() ?? import.meta.env.SITE,
	);

	return createMarkdownResponse(markdown);
};
