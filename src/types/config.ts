import type { AUTO_MODE, DARK_MODE, LIGHT_MODE } from "@constants/constants";
import type { WalineInitOptions } from "@waline/client";

export type SiteConfig = {
	title: string;
	subtitle: string;

	lang:
		| "en"
		| "zh_CN"
		| "zh_TW"
		| "ja"
		| "ko"
		| "es"
		| "th"
		| "vi"
		| "tr"
		| "id";

	themeColor: {
		hue: number;
		fixed: boolean;
	};
	banner: {
		enable: boolean;
		src: string;
		position?: "top" | "center" | "bottom";
		credit: {
			enable: boolean;
			text: string;
			url?: string;
		};
	};
	toc: {
		enable: boolean;
		depth: 1 | 2 | 3;
	};
	favicon: string;
};

export enum LinkPreset {
	Home = 0,
	Archive = 1,
	About = 2,
}

export type NavBarLink = {
	name: string;
	url?: string;
	external?: boolean;
	sublinks?: NavBarLink[];
};

export type NavBarConfig = {
	links: (NavBarLink | LinkPreset)[];
};

export type ProfileConfig = {
	avatar?: string;
	name: string;
	bio?: string;
	links: {
		name: string;
		url: string;
		icon: string;
	}[];
};

export type AnnouncementConfig = {
	enable: boolean;
	content: string;
};

export type LicenseConfig = {
	enable: boolean;
};

export type WalineConfig = {
	enable: boolean;
	serverURL: string;
	path?: string;
	lang?: string;
	locale?: WalineInitOptions["locale"];
	emoji?: WalineInitOptions["emoji"];
	dark?: string;
	meta?: ("nick" | "mail" | "link")[];
	requiredMeta?: ("nick" | "mail")[];
	login?: "enable" | "disable" | "force";
	wordLimit?: number | [number, number];
	pageSize?: number;
	imageUploader?: boolean;
	search?: WalineInitOptions["search"];
	recaptchaV3Key?: string;
	turnstileKey?: string;
	reaction?: boolean | string[];
	noCopyright?: boolean;
	commentSorting?: "latest" | "oldest" | "hottest";
	avatar?: string;
	avatarCDN?: string;
	avatarForce?: boolean;
};

export type LIGHT_DARK_MODE =
	| typeof LIGHT_MODE
	| typeof DARK_MODE
	| typeof AUTO_MODE;

export type ExpressiveCodeConfig = {
	theme: string;
};
