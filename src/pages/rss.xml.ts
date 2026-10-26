import rss from "@astrojs/rss";
import { getEntrySlug, getSortedPosts } from "@utils/content-utils";
import { url } from "@utils/url-utils";
import type { APIContext } from "astro";
import { siteConfig } from "@/config";

const RSS_ITEM_LIMIT = 20;

function stripInvalidXmlChars(str: string): string {
	return str.replace(
		// biome-ignore lint/suspicious/noControlCharactersInRegex: https://www.w3.org/TR/xml/#charsets
		/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F\uFDD0-\uFDEF\uFFFE\uFFFF]/g,
		"",
	);
}

export async function GET(context: APIContext): Promise<Response> {
	const blog = (await getSortedPosts()).slice(0, RSS_ITEM_LIMIT);
	const fallbackSite = new URL("https://lib.sci-adv.org");
	const site = context.site ?? fallbackSite;
	const selfUrl = new URL("rss.xml", site).href;

	return rss({
		title: siteConfig.title,
		description: siteConfig.subtitle || "No description",
		site,
		xmlns: {
			atom: "http://www.w3.org/2005/Atom",
		},
		customData: [
			`<language>${siteConfig.lang.replace("_", "-")}</language>`,
			`<lastBuildDate>${(blog[0]?.data.date ?? new Date()).toUTCString()}</lastBuildDate>`,
			"<ttl>60</ttl>",
			`<atom:link href="${selfUrl}" rel="self" type="application/rss+xml" />`,
		].join(""),
		items: blog.map((post) => {
			const frontmatter = post.rendered?.metadata?.frontmatter as
				| { excerpt?: string }
				| undefined;
			const excerpt =
				post.data.description?.trim() ||
				frontmatter?.excerpt?.trim() ||
				post.data.title;
			const categories = [
				...new Set([...post.data.categories, ...post.data.tags]),
			];

			return {
				title: post.data.title,
				pubDate: post.data.updated ?? post.data.date,
				description: stripInvalidXmlChars(excerpt),
				link: new URL(url(`/archives/${getEntrySlug(post)}/`), site).href,
				categories,
			};
		}),
	});
}
