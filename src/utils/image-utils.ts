import path from "node:path";
import type { ImageMetadata } from "astro";

const imageFiles = import.meta.glob<ImageMetadata>(
	"../**/*.{jpg,jpeg,png,webp,gif,avif,svg}",
	{ import: "default" },
);

export async function resolveLocalImage(
	src: string,
	basePath = "",
): Promise<ImageMetadata | undefined> {
	const normalizedSrc = src.replace(/\\/g, "/");
	const normalizedPath = normalizedSrc.includes("assets/")
		? path
				.normalize(path.join("../", normalizedSrc.replace(/^(\.\.\/)+/, "")))
				.replace(/\\/g, "/")
		: path
				.normalize(path.join("../", basePath, src))
				.replace(/\\/g, "/");
	const file = imageFiles[normalizedPath];
	if (!file) {
		console.error(
			`\n[ERROR] Image file not found: ${normalizedPath.replace("../", "src/")}`,
		);
		return undefined;
	}
	return await file();
}
