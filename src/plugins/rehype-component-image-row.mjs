/// <reference types="mdast" />
import { h } from "hastscript";

function flattenChildren(children) {
	return children.flatMap((child) => {
		if (child && child.type === "element" && child.tagName === "p") {
			return child.children ?? [];
		}
		return [child];
	});
}

export function ImageRowComponent(properties, children) {
	const align = properties?.align === "left" || properties?.align === "right"
		? properties.align
		: "center";

	return h(
		"div",
		{
			class: ["image-row", `image-row--${align}`],
		},
		flattenChildren(children),
	);
}
