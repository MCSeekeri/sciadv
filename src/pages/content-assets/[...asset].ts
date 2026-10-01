import { readFile } from "node:fs/promises";
import type { APIRoute, GetStaticPaths } from "astro";
import sharp from "sharp";
import type {
	ContentImageDescriptor,
	OutputFormat,
} from "@/plugins/content-image-manifest.ts";
import {
	assetKindFor,
	contentImageManifest,
	contentTypeForFormat,
	variantWidthsByKind,
} from "@/plugins/content-image-manifest.ts";

function variantListFor(
	descriptor: ContentImageDescriptor,
): { width: number; format: OutputFormat }[] {
	const widths = variantWidthsByKind[assetKindFor(descriptor.assetKey)];
	// fallbackFormat 可能不在 formats 里，需并集去重，否则该 URL 未预渲染而 404。
	const formats = descriptor.formats.includes(descriptor.fallbackFormat)
		? descriptor.formats
		: [...descriptor.formats, descriptor.fallbackFormat];

	return widths.flatMap((width) =>
		formats.map((format) => ({ width, format })),
	);
}

function buildAssetParam(
	assetKey: string,
	width: number,
	format: OutputFormat,
): string {
	return `${assetKey}@${width}.${format}`;
}

export const getStaticPaths: GetStaticPaths = () => {
	return contentImageManifest.flatMap((descriptor) =>
		variantListFor(descriptor).map(({ width, format }) => ({
			params: {
				asset: buildAssetParam(descriptor.assetKey, width, format),
			},
			props: {
				descriptor,
				width,
				format,
			},
		})),
	);
};

export const GET: APIRoute = async ({ props }): Promise<Response> => {
	const { descriptor, width, format } = props as {
		descriptor: ContentImageDescriptor;
		width: number;
		format: OutputFormat;
	};

	if (format === "svg" || format === "gif") {
		const data = await readFile(descriptor.sourcePath);
		return new Response(data, {
			headers: {
				"Content-Type": contentTypeForFormat(format),
				"Cache-Control": "public, max-age=31536000, immutable",
			},
		});
	}

	const pipeline = sharp(descriptor.sourcePath).resize({
		width,
		withoutEnlargement: true,
	});

	let output: Uint8Array;
	if (format === "jpg") {
		output = await pipeline.jpeg({ quality: 82 }).toBuffer();
	} else if (format === "png") {
		output = await pipeline.png({ quality: 90 }).toBuffer();
	} else if (format === "webp") {
		output = await pipeline.webp({ quality: 82 }).toBuffer();
	} else {
		output = await pipeline.avif({ quality: 60 }).toBuffer();
	}

	return new Response(Uint8Array.from(output).buffer, {
		headers: {
			"Content-Type": contentTypeForFormat(format),
			"Cache-Control": "public, max-age=31536000, immutable",
		},
	});
};
