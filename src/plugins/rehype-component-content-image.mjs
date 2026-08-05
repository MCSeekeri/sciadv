/// <reference types="mdast" />
import { h } from "hastscript";
import {
	buildContentImageVariantPath,
	getContentImageDescriptor,
	contentTypeForFormat,
	legalWidthsFor,
	resolveWidth,
} from "./content-image-manifest.ts";

function normalizeDimension(value, fallback) {
	if (typeof value === "number") {
		return Number.isFinite(value) && value > 0 ? value : fallback;
	}

	if (typeof value === "string") {
		const parsed = Number.parseInt(value, 10);
		return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
	}

	return fallback;
}

function buildResponsivePicture({
	descriptor,
	alt,
	width,
	className,
	noLightbox = false,
}) {
	const widths = [width, width * 2].filter((w) =>
		legalWidthsFor(descriptor).includes(w),
	);
	const sourceFormats = descriptor.formats.filter(
		(format) => format !== descriptor.fallbackFormat,
	);

	return h("picture", {}, [
		...sourceFormats.map((format) =>
			h("source", {
				type: contentTypeForFormat(format),
				sizes: `${width}px`,
				srcset: widths
					.map(
						(variantWidth, index) =>
							`${buildContentImageVariantPath(descriptor.assetKey, variantWidth, format)} ${index + 1}x`,
					)
					.join(", "),
			}),
		),
		h("img", {
			class: className,
			alt,
			loading: "lazy",
			decoding: "async",
			...(noLightbox ? { "data-no-lightbox": "true" } : {}),
			width,
			src: buildContentImageVariantPath(
				descriptor.assetKey,
				width,
				descriptor.fallbackFormat,
			),
			srcset: widths
				.map(
					(variantWidth, index) =>
						`${buildContentImageVariantPath(descriptor.assetKey, variantWidth, descriptor.fallbackFormat)} ${index + 1}x`,
				)
				.join(", "),
		}),
	]);
}

export function ContentImageComponent(properties, children) {
	const descriptor = getContentImageDescriptor(properties?.src ?? "");
	if (!descriptor) {
		return h("div", { class: "hidden" }, "Invalid image directive source.");
	}

	const alt = typeof properties?.alt === "string" && properties.alt.trim() !== ""
		? properties.alt
		: Array.isArray(children)
			? children.map((child) => child.value ?? "").join("").trim()
			: "";
	const requestedWidth = normalizeDimension(
		properties?.["data-width"] ?? properties?.dataWidth ?? properties?.width,
		800,
	);
	const width = resolveWidth(descriptor, requestedWidth);
	if (width !== requestedWidth) {
		console.warn(
			`[content-image] No variant for width ${requestedWidth} of ${descriptor.assetKey}; using ${width}.`,
		);
	}

	return buildResponsivePicture({
		descriptor,
		alt,
		width,
		className: "content-image",
	});
}

export function InlineAvatarComponent(properties, children) {
	const descriptor = getContentImageDescriptor(properties?.src ?? "");
	if (!descriptor) {
		return h("span", { class: "hidden" }, "Invalid avatar directive source.");
	}

	const alt = typeof properties?.alt === "string" && properties.alt.trim() !== ""
		? properties.alt
		: Array.isArray(children)
			? children.map((child) => child.value ?? "").join("").trim()
			: "";
	const requestedWidth = normalizeDimension(
		properties?.["data-size"] ?? properties?.dataSize ?? properties?.size ?? properties?.["data-width"] ?? properties?.dataWidth ?? properties?.width,
		24,
	);
	const width = resolveWidth(descriptor, requestedWidth);
	if (width !== requestedWidth) {
		console.warn(
			`[content-image] No variant for width ${requestedWidth} of ${descriptor.assetKey}; using ${width}.`,
		);
	}

	return buildResponsivePicture({
		descriptor,
		alt,
		width,
		className: "inline-avatar",
		noLightbox: true,
	});
}
