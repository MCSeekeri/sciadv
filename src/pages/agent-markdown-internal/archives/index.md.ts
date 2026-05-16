import { i18n } from "@i18n/translation";
import I18nKey from "@i18n/i18nKey";
import {
	buildArchiveMarkdown,
	createMarkdownResponse,
} from "@utils/agent-readiness";
import { getSortedPostsList } from "@utils/content-utils";
import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ site }) => {
	const posts = await getSortedPostsList();
	const markdown = buildArchiveMarkdown(
		i18n(I18nKey.archive),
		"SciADV library archive index.",
		posts,
		site?.toString() ?? import.meta.env.SITE,
	);

	return createMarkdownResponse(markdown);
};
