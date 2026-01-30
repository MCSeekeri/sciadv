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
	favicon: "/favicon/favicon.png",
};

export const navBarConfig: NavBarConfig = {
	links: [
		LinkPreset.Archive,
		LinkPreset.About,
		{
			name: "科 A 资源站",
			url: "https://drive.sci-adv.cc",
			external: true,
		},
		{
			name: "开往",
			url: "https://www.travellings.cn/go.html",
			external: true,
		},
		{
			name: "外部链接",
			sublinks: [
				{
					name: "站点源代码",
					url: "https://github.com/MCSeekeri/sciadv",
					external: true,
				},
				{
					name: "CD 整理",
					url: "https://docs.google.com/document/d/1iy8uuAqUtINnfYP_DYmCStDTz_CA6O9W/edit",
					external: true,
				},
			],
		},
	],
};

export const profileConfig: ProfileConfig = {
	avatar: "assets/authors/mp.jpg",
	name: "Anonymous",
	bio: "",
	links: [],
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
	imageUploader: undefined,
	search: false,
	noCopyright: false,
	commentSorting: "latest",
};

export const announcementConfig: AnnouncementConfig = {
	enable: true,
	content: `欢迎来到科学 ADV 图书馆重构版本
遇到任何问题欢迎反馈，缺失的部分功能会在未来补齐或彻底弃用`,
};
