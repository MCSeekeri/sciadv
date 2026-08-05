import rss from "@astrojs/rss";
import { getEntrySlug, getSortedPosts } from "@utils/content-utils";
import { url } from "@utils/url-utils";
import type { APIContext } from "astro";
import sanitizeHtml from "sanitize-html";
import { siteConfig } from "@/config";

function stripInvalidXmlChars(str: string): string {
	return str.replace(
		// biome-ignore lint/suspicious/noControlCharactersInRegex: https://www.w3.org/TR/xml/#charsets
		/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F\uFDD0-\uFDEF\uFFFE\uFFFF]/g,
		"",
	);
}

export async function GET(context: APIContext): Promise<Response> {
	const blog = await getSortedPosts();

	return rss({
		title: siteConfig.title,
		description: siteConfig.subtitle || "No description",
		site: context.site ?? new URL(import.meta.env.SITE),
		items: blog.map((post) => {
			const html = (post.rendered?.html ?? "")
				.replaceAll(
					'src="/content-assets/',
					`src="${new URL("/content-assets/", context.site).href}`,
				)
				.replaceAll(
					'srcset="/content-assets/',
					`srcset="${new URL("/content-assets/", context.site).href}`,
				);
			const cleanedHtml = stripInvalidXmlChars(html);
			return {
				title: post.data.title,
				pubDate: post.data.date,
				description: post.data.description || "",
				link: url(`/archives/${getEntrySlug(post)}/`),
				content: sanitizeHtml(cleanedHtml, {
					allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
				}),
			};
		}),
		customData: `<language>${siteConfig.lang.replace("_", "-").toLowerCase()}</language>`,
	});
}
