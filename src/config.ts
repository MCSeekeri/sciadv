import type {
	AnnouncementConfig,
	ExpressiveCodeConfig,
	LicenseConfig,
	NavBarConfig,
	ProfileConfig,
	SiteConfig,
	WalineConfig,
} from "./types/config";
import { LinkPreset } from "./types/config";

export const siteConfig: SiteConfig = {
	title: "科学 ADV 图书馆",
	subtitle: "致力于收集科学 ADV 系列所有小说和漫画的站点",
	lang: "zh_CN",
	themeColor: {
		hue: 250,
		fixed: false,
	},
	banner: {
		enable: true,
		src: "./assets/images/banner.jpg",
		position: "top",
		credit: {
			enable: true,
			text: "kumatmo 草熊",
			url: "https://www.pixiv.net/artworks/22889135",
		},
	},
	toc: {
		enable: true,
		depth: 3,
	},
	favicon: [
	],
};

export const navBarConfig: NavBarConfig = {
	links: [
		LinkPreset.Home,
		LinkPreset.Archive,
		LinkPreset.About,
		{
			name: "GitHub",
			url: "https://github.com/MCSeekeri/sciadv",
			external: true,
		},
		{
			name: "开往",
			url: "https://www.travellings.cn/go.html",
			external: true,
		},
	],
};

export const profileConfig: ProfileConfig = {
	avatar: "assets/authors/mp.jpg",
	name: "Anonymous",
	bio: "",
	links: [
	],
};

export const licenseConfig: LicenseConfig = {
	enable: true,
};

export const expressiveCodeConfig: ExpressiveCodeConfig = {
	theme: "github-dark",
};

export const walineConfig: WalineConfig = {
	enable: true,
	serverURL: "https://comments.sci-adv.cc",
	lang: "zh-CN",
	dark: "html.dark",
	meta: ["nick", "mail", "link"],
	requiredMeta: ["nick"],
	login: "enable",
	wordLimit: [0, 1000],
	pageSize: 10,
	imageUploader: false,
	search: false,
	noCopyright: false,
	commentSorting: "latest",
};

export const announcementConfig: AnnouncementConfig = {
	enable: true,
	content: `欢迎来到科学 ADV 图书馆重构版本
遇到任何问题欢迎反馈，缺失的部分功能会在未来补齐或彻底弃用`,
};
