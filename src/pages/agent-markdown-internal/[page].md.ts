import { PAGE_SIZE } from "@constants/constants";
import { siteConfig } from "@/config";
import {
	buildIndexMarkdown,
	createMarkdownResponse,
} from "@utils/agent-readiness";
import { getSortedPostsList } from "@utils/content-utils";
import type { APIRoute } from "astro";

export async function getStaticPaths(): Promise<{ params: { page: string } }[]> {
	const posts = await getSortedPostsList();
	const totalPages = Math.max(1, Math.ceil(posts.length / PAGE_SIZE));

	return Array.from({ length: Math.max(0, totalPages - 1) }, (_, index) => ({
		params: { page: String(index + 2) },
	}));
}

export const GET: APIRoute = async ({ params, site }): Promise<Response> => {
	const currentPage = Number(params.page);
	if (!Number.isInteger(currentPage) || currentPage < 2) {
		return new Response("Not found", { status: 404 });
	}

	const posts = await getSortedPostsList();
	const totalPages = Math.max(1, Math.ceil(posts.length / PAGE_SIZE));
	if (currentPage > totalPages) {
		return new Response("Not found", { status: 404 });
	}

	const markdown = buildIndexMarkdown(
		siteConfig.title,
		siteConfig.subtitle,
		posts,
		site?.toString() ?? import.meta.env.SITE,
		currentPage,
	);

	return createMarkdownResponse(markdown);
};
