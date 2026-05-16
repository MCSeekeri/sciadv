import { getEntry } from "astro:content";
import { i18n } from "@i18n/translation";
import I18nKey from "@i18n/i18nKey";
import {
	buildAboutMarkdown,
	createMarkdownResponse,
} from "@utils/agent-readiness";
import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ site }) => {
	const aboutPost = await getEntry("spec", "about");
	if (!aboutPost) {
		return new Response("Not found", { status: 404 });
	}

	const markdown = buildAboutMarkdown(
		i18n(I18nKey.about),
		aboutPost.body ?? "",
		site?.toString() ?? import.meta.env.SITE,
	);

	return createMarkdownResponse(markdown);
};
