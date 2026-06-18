import path from "node:path";

export type OutputFormat = "avif" | "webp" | "jpg" | "png";

export interface ContentImageDescriptor {
	assetKey: string;
	sourcePath: string;
	formats: OutputFormat[];
	fallbackFormat: OutputFormat;
}

export const contentImageManifest: ContentImageDescriptor[] = [
	{
		assetKey: "authors/古晟天.jpg",
		sourcePath: path.join(process.cwd(), "src/assets/authors/古晟天.jpg"),
		formats: ["avif", "webp", "jpg"],
		fallbackFormat: "jpg",
	},
	{
		assetKey: "authors/Kariya_Misaki.png",
		sourcePath: path.join(process.cwd(), "src/assets/authors/Kariya_Misaki.png"),
		formats: ["avif", "webp", "png"],
		fallbackFormat: "png",
	},
	{
		assetKey: "authors/tgy.webp",
		sourcePath: path.join(process.cwd(), "src/assets/authors/tgy.webp"),
		formats: ["avif", "webp"],
		fallbackFormat: "webp",
	},
	{
		assetKey: "authors/serika.jpg",
		sourcePath: path.join(process.cwd(), "src/assets/authors/serika.jpg"),
		formats: ["avif", "webp", "jpg"],
		fallbackFormat: "jpg",
	},
	{
		assetKey: "authors/反物质委员会.jpg",
		sourcePath: path.join(process.cwd(), "src/assets/authors/反物质委员会.jpg"),
		formats: ["avif", "webp", "jpg"],
		fallbackFormat: "jpg",
	},
	{
		assetKey: "images/community/steinsgate.jpg",
		sourcePath: path.join(process.cwd(), "src/assets/images/community/steinsgate.jpg"),
		formats: ["avif", "webp", "jpg"],
		fallbackFormat: "jpg",
	},
	{
		assetKey: "images/community/sciadv.jpg",
		sourcePath: path.join(process.cwd(), "src/assets/images/community/sciadv.jpg"),
		formats: ["avif", "webp", "jpg"],
		fallbackFormat: "jpg",
	},
];

const manifestByAssetKey: Record<string, ContentImageDescriptor> = Object.fromEntries(
	contentImageManifest.map((descriptor) => [descriptor.assetKey, descriptor]),
);

export function normalizeDirectiveSource(src: string): string {
	return src
		.replace(/\\/g, "/")
		.replace(/^\/+/, "")
		.replace(/^(\.\.\/)+/, "")
		.replace(/^assets\//, "");
}

export function getContentImageDescriptor(src: string): ContentImageDescriptor | undefined {
	return manifestByAssetKey[normalizeDirectiveSource(src)];
}

export function buildContentImageVariantPath(
	assetKey: string,
	width: number,
	format: OutputFormat,
): string {
	return `/content-assets/${assetKey}@${width}.${format}`;
}

export function contentTypeForFormat(format: OutputFormat): string {
	if (format === "jpg") {
		return "image/jpeg";
	}
	return `image/${format}`;
}
