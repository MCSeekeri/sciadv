import { authors, type Author } from "../authors";
import { profileConfig } from "../config";

export function resolveAuthor(
	authorId: string | undefined,
	siteUrl: string,
): Author {
	if (authorId && authors[authorId]) {
		return authors[authorId];
	}

	return {
		name: profileConfig.name,
		avatar: profileConfig.avatar ?? "",
		url: siteUrl,
	};
}
