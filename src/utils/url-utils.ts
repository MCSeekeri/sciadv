import I18nKey from "@i18n/i18nKey";
import { i18n } from "@i18n/translation";

export function pathsEqual(path1: string, path2: string): boolean {
	const normalizedPath1 = path1.replace(/^\/|\/$/g, "").toLowerCase();
	const normalizedPath2 = path2.replace(/^\/|\/$/g, "").toLowerCase();
	return normalizedPath1 === normalizedPath2;
}

function joinUrl(...parts: string[]): string {
	const joined = parts.join("/");
	return joined.replace(/\/+/g, "/");
}

export function getPostUrlBySlug(slug: string): string {
	return url(`/archives/${slug}/`);
}

export function getTagUrl(tag: string): string {
	if (!tag) return url("/archives/");
	return url(`/archives/?tag=${encodeURIComponent(tag.trim())}`);
}

export function getCategoryUrl(categories: string | null): string {
	if (
		!categories ||
		categories.trim() === "" ||
		categories.trim().toLowerCase() ===
			i18n(I18nKey.uncategorized).toLowerCase()
	)
		return url("/archives/?uncategorized=true");
	return url(`/archives/?categories=${encodeURIComponent(categories.trim())}`);
}

export function getDir(path: string): string {
	const lastSlashIndex = path.lastIndexOf("/");
	if (lastSlashIndex < 0) {
		return "/";
	}
	return path.substring(0, lastSlashIndex + 1);
}

export function url(path: string): string {
	return joinUrl("", import.meta.env.BASE_URL, path);
}
