import { type CollectionEntry, getCollection } from "astro:content";
import I18nKey from "@i18n/i18nKey";
import { i18n } from "@i18n/translation";
import { getCategoryUrl } from "@utils/url-utils";

const isPublished = ({ data }: { data: { draft?: boolean } }) =>
	import.meta.env.PROD ? data.draft !== true : true;

export type AdjacentPost = {
	slug: string;
	title: string;
};

export type SortedPost = CollectionEntry<"archives"> & {
	slug: string;
	prev?: AdjacentPost;
	next?: AdjacentPost;
};

async function getRawSortedPosts() {
	const allBlogPosts = await getCollection("archives", isPublished);

	return allBlogPosts.sort((a, b) => {
		const timeDiff = b.data.date.getTime() - a.data.date.getTime();
		if (timeDiff !== 0) {
			return timeDiff;
		}

		return getEntrySlug(a).localeCompare(getEntrySlug(b));
	});
}

export function getEntrySlug(entry: { id: string; slug?: string }): string {
	return entry.slug || entry.id.replace(/\.(md|mdx)$/i, "");
}

export async function getSortedPosts(): Promise<SortedPost[]> {
	const sorted = await getRawSortedPosts();

	return sorted.map((entry, index) => ({
		...entry,
		slug: getEntrySlug(entry),
		prev:
			index < sorted.length - 1
				? {
						slug: getEntrySlug(sorted[index + 1]),
						title: sorted[index + 1].data.title,
					}
				: undefined,
		next:
			index > 0
				? {
						slug: getEntrySlug(sorted[index - 1]),
						title: sorted[index - 1].data.title,
					}
				: undefined,
	}));
}

export type PostForList = {
	slug: string;
	data: CollectionEntry<"archives">["data"];
};
export async function getSortedPostsList(): Promise<PostForList[]> {
	const sortedFullPosts = await getRawSortedPosts();

	// delete post.body
	const sortedPostsList = sortedFullPosts.map((post) => ({
		slug: getEntrySlug(post),
		data: post.data,
	}));

	return sortedPostsList;
}
export type Tag = {
	name: string;
	count: number;
};

export async function getTagList(): Promise<Tag[]> {
	const allBlogPosts = await getCollection<"archives">(
		"archives",
		isPublished,
	);

	const countMap: { [key: string]: number } = {};
	allBlogPosts.forEach((post: { data: { tags: string[] } }) => {
		post.data.tags.forEach((tag: string) => {
			if (!countMap[tag]) countMap[tag] = 0;
			countMap[tag]++;
		});
	});

	// sort tags
	const keys: string[] = Object.keys(countMap).sort((a, b) => {
		return a.toLowerCase().localeCompare(b.toLowerCase());
	});

	return keys.map((key) => ({ name: key, count: countMap[key] }));
}

export type Category = {
	name: string;
	count: number;
	url: string;
};

export async function getCategoryList(): Promise<Category[]> {
	const allBlogPosts = await getCollection<"archives">(
		"archives",
		isPublished,
	);
	const count: { [key: string]: number } = {};
	allBlogPosts.forEach((post: { data: { categories: string[] } }) => {
		if (!post.data.categories || post.data.categories.length === 0) {
			const ucKey = i18n(I18nKey.uncategorized);
			count[ucKey] = count[ucKey] ? count[ucKey] + 1 : 1;
			return;
		}

		post.data.categories.forEach((cat) => {
			const trimmedCat = cat.trim();
			count[trimmedCat] = count[trimmedCat] ? count[trimmedCat] + 1 : 1;
		});
	});

	const lst = Object.keys(count).sort((a, b) => {
		return a.toLowerCase().localeCompare(b.toLowerCase());
	});

	const ret: Category[] = [];
	for (const c of lst) {
		ret.push({
			name: c,
			count: count[c],
			url: getCategoryUrl(c),
		});
	}
	return ret;
}
