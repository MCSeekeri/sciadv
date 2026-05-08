import { init } from "@waline/client";
import walineStyleUrl from "@waline/client/style?url";

type WalineClientOptions = Record<string, unknown> & {
	serverURL?: string;
};

const initializedRoots = new WeakSet<HTMLElement>();

function ensureWalineStyles() {
	const existingLink = document.querySelector<HTMLLinkElement>(
		`link[data-waline-style][href="${walineStyleUrl}"]`,
	);
	if (existingLink) {
		return;
	}

	const styleLink = document.createElement("link");
	styleLink.rel = "stylesheet";
	styleLink.href = walineStyleUrl;
	styleLink.dataset.walineStyle = "true";
	document.head.appendChild(styleLink);
}

function initWaline(root: Element) {
	if (!(root instanceof HTMLElement) || initializedRoots.has(root)) {
		return;
	}

	const container = root.querySelector("[data-waline-container]");
	if (!(container instanceof HTMLElement)) {
		return;
	}

	const rawOptions = root.dataset.walineOptions;
	if (!rawOptions) {
		return;
	}

	const options = JSON.parse(rawOptions) as WalineClientOptions;
	if (!options.serverURL) {
		console.warn("Waline serverURL is not configured");
		return;
	}
	const { serverURL, ...restOptions } = options;

	ensureWalineStyles();
	init({
		el: container,
		serverURL,
		...restOptions,
	});
	initializedRoots.add(root);
}

function observeWaline(root: Element) {
	if (!(root instanceof HTMLElement) || initializedRoots.has(root)) {
		return;
	}

	if (!("IntersectionObserver" in window)) {
		initWaline(root);
		return;
	}

	const observer = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (!entry.isIntersecting) {
					continue;
				}
				observer.disconnect();
				initWaline(root);
				break;
			}
		},
		{
			rootMargin: "200px 0px",
		},
	);

	observer.observe(root);
}

for (const root of document.querySelectorAll("[data-waline-root]")) {
	observeWaline(root);
}
