import { readdirSync } from "node:fs";
import path from "node:path";
import { authors } from "../authors";

export type OutputFormat = "avif" | "webp" | "jpg" | "png";

export interface ContentImageDescriptor {
	assetKey: string;
	sourcePath: string;
	formats: OutputFormat[];
	fallbackFormat: OutputFormat;
}

export const variantWidthsByKind = {
	authors: [20, 30, 40, 60],
	community: [200, 400],
} as const;

export function assetKindFor(assetKey: string): "authors" | "community" {
	return assetKey.startsWith("authors/") ? "authors" : "community";
}

export function legalWidthsFor(
	descriptor: ContentImageDescriptor,
): readonly number[] {
	return variantWidthsByKind[assetKindFor(descriptor.assetKey)];
}

export function resolveWidth(
	descriptor: ContentImageDescriptor,
	requested: number,
): number {
	const widths = legalWidthsFor(descriptor);
	return widths.find((w) => w >= requested) ?? widths[widths.length - 1];
}

function formatsForFile(
	fileName: string,
): Pick<ContentImageDescriptor, "formats" | "fallbackFormat"> | null {
	const extension = path.extname(fileName).slice(1).toLowerCase();
	switch (extension) {
		case "jpg":
		case "jpeg":
			return { formats: ["avif", "webp", "jpg"], fallbackFormat: "jpg" };
		case "png":
			return { formats: ["avif", "webp", "png"], fallbackFormat: "png" };
		case "webp":
			return { formats: ["avif", "webp"], fallbackFormat: "webp" };
		default:
			return null;
	}
}

function buildManifest(): ContentImageDescriptor[] {
	const manifest: ContentImageDescriptor[] = [];

	for (const dir of ["src/assets/authors", "src/assets/images/community"]) {
		const basePath = path.join(process.cwd(), dir);
		const prefix = dir.replace(/^src\/assets\//, "");
		for (const fileName of readdirSync(basePath)) {
			const formats = formatsForFile(fileName);
			if (!formats) {
				continue;
			}
			manifest.push({
				assetKey: `${prefix}/${fileName}`,
				sourcePath: path.join(basePath, fileName),
				...formats,
			});
		}
	}

	return manifest;
}

export const contentImageManifest: ContentImageDescriptor[] = buildManifest();

const manifestByAssetKey: Record<string, ContentImageDescriptor> =
	Object.fromEntries(
		contentImageManifest.map((descriptor) => [
			descriptor.assetKey,
			descriptor,
		]),
	);

for (const author of Object.values(authors)) {
	const assetKey = author.avatar.replace(/^assets\//, "");
	if (!manifestByAssetKey[assetKey]) {
		console.error(
			`[content-image-manifest] Missing author avatar in manifest: ${assetKey}`,
		);
	}
}

export function normalizeDirectiveSource(src: string): string {
	return src
		.replace(/\\/g, "/")
		.replace(/^\/+/, "")
		.replace(/^(\.\.\/)+/, "")
		.replace(/^assets\//, "");
}

export function getContentImageDescriptor(
	src: string,
): ContentImageDescriptor | undefined {
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
