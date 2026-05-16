import { PAGE_SIZE } from "@constants/constants";
import { siteConfig } from "@/config";
import { getEntrySlug, type PostForList, type SortedPost } from "@utils/content-utils";
import { formatDateToYYYYMMDD } from "@utils/date-utils";
import { resolveAuthor } from "@utils/author-utils";

export const CONTENT_SIGNAL_DIRECTIVE =
	"ai-train=no, search=yes, ai-input=yes";

export function createMarkdownResponse(markdown: string): Response {
	const body = markdown.trimEnd().concat("\n");

	return new Response(body, {
		headers: {
			"Content-Type": "text/markdown; charset=utf-8",
			Vary: "Accept",
			"X-Markdown-Tokens": estimateMarkdownTokens(body),
		},
	});
}

export function estimateMarkdownTokens(markdown: string): string {
	const normalized = markdown.replace(/\s+/g, " ").trim();
	if (!normalized) {
		return "0";
	}

	return String(Math.ceil(Array.from(normalized).length / 4));
}

export function buildSiteFrontmatter(extra: Record<string, string>): string {
	const frontmatterEntries = Object.entries({
		title: siteConfig.title,
		language: siteConfig.lang.replace("_", "-"),
		...extra,
	});

	return [
		"---",
		...frontmatterEntries.map(([key, value]) => `${key}: "${escapeFrontmatterValue(value)}"`),
		"---",
		"",
	].join("\n");
}

export function buildPostMarkdown(entry: SortedPost, siteUrl: string): string {
	const author = resolveAuthor(entry.data.author, siteUrl);
	const slug = getEntrySlug(entry);
	const canonicalUrl = absoluteUrl(siteUrl, `/archives/${slug}/`);
	const tags = entry.data.tags.length > 0 ? entry.data.tags.join(", ") : "";
	const categories =
		entry.data.categories.length > 0 ? entry.data.categories.join(", ") : "";
	const description = entry.data.description?.trim() || entry.data.title;

	return [
		buildSiteFrontmatter({
			page_title: entry.data.title,
			page_type: "article",
			canonical_url: canonicalUrl,
			author: author.name,
			published: formatDateToYYYYMMDD(entry.data.date),
			updated: entry.data.updated
				? formatDateToYYYYMMDD(entry.data.updated)
				: formatDateToYYYYMMDD(entry.data.date),
			tags,
			categories,
			description,
		}),
		(entry.body ?? "").trim(),
		"",
		"---",
		"",
		`Canonical URL: ${canonicalUrl}`,
	].join("\n");
}

export function buildIndexMarkdown(
	title: string,
	description: string,
	posts: PostForList[],
	siteUrl: string,
	currentPage = 1,
): string {
	const totalPages = Math.max(1, Math.ceil(posts.length / PAGE_SIZE));
	const pagePosts = posts.slice(
		(currentPage - 1) * PAGE_SIZE,
		currentPage * PAGE_SIZE,
	);

	return [
		buildSiteFrontmatter({
			page_title: currentPage === 1 ? title : `${title} - Page ${currentPage}`,
			page_type: "index",
			canonical_url:
				currentPage === 1
					? absoluteUrl(siteUrl, "/")
					: absoluteUrl(siteUrl, `/${currentPage}/`),
			current_page: String(currentPage),
			total_pages: String(totalPages),
			description,
		}),
		`# ${title}`,
		"",
		description,
		"",
		`Page ${currentPage} of ${totalPages}`,
		"",
		"## Recent Posts",
		"",
		...pagePosts.flatMap((post) => formatPostListItem(post, siteUrl)),
	].join("\n");
}

export function buildArchiveMarkdown(
	title: string,
	description: string,
	posts: PostForList[],
	siteUrl: string,
): string {
	const groupedPosts = posts.reduce<Record<string, PostForList[]>>((groups, post) => {
		const year = String(post.data.date.getFullYear());
		groups[year] ??= [];
		groups[year].push(post);
		return groups;
	}, {});

	return [
		buildSiteFrontmatter({
			page_title: title,
			page_type: "archive",
			canonical_url: absoluteUrl(siteUrl, "/archives/"),
			description,
		}),
		`# ${title}`,
		"",
		description,
		"",
		...Object.entries(groupedPosts).flatMap(([year, yearPosts]) => [
			`## ${year}`,
			"",
			...yearPosts.flatMap((post) => formatArchiveListItem(post, siteUrl)),
		]),
	].join("\n");
}

export function buildAboutMarkdown(
	title: string,
	body: string,
	siteUrl: string,
): string {
	return [
		buildSiteFrontmatter({
			page_title: title,
			page_type: "page",
			canonical_url: absoluteUrl(siteUrl, "/about/"),
			description: title,
		}),
		body.trim(),
	].join("\n");
}

export function absoluteUrl(siteUrl: string, path: string): string {
	return new URL(path, siteUrl).href;
}

function formatPostListItem(post: PostForList, siteUrl: string): string[] {
	const slug = post.slug;
	const canonicalUrl = absoluteUrl(siteUrl, `/archives/${slug}/`);
	const description = post.data.description?.trim();
	const author = resolveAuthor(post.data.author, siteUrl).name;
	const categories =
		post.data.categories.length > 0
			? `Categories: ${post.data.categories.join(", ")}`
			: "Categories: none";
	const tags =
		post.data.tags.length > 0 ? `Tags: ${post.data.tags.join(", ")}` : "Tags: none";

	return [
		`- [${post.data.title}](${canonicalUrl})`,
		`  Published: ${formatDateToYYYYMMDD(post.data.date)}`,
		`  Author: ${author}`,
		`  ${categories}`,
		`  ${tags}`,
		...(description ? [`  Summary: ${description}`] : []),
		"",
	];
}

function formatArchiveListItem(post: PostForList, siteUrl: string): string[] {
	return [
		`- ${formatDateToYYYYMMDD(post.data.date)} - [${post.data.title}](${absoluteUrl(siteUrl, `/archives/${post.slug}/`)})`,
	];
}

function escapeFrontmatterValue(value: string): string {
	return value.replaceAll("\\", "\\\\").replaceAll('"', '\\"');
}
