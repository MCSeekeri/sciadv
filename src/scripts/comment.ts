type WalineClientOptions = Record<string, unknown> & {
	serverURL?: string;
};

const initializedRoots: WeakSet<HTMLElement> = new WeakSet<HTMLElement>();
let walineModulePromise: Promise<typeof import("@waline/client")> | undefined;
let walineStyleUrlPromise: Promise<string> | undefined;

function loadWalineModule(): Promise<typeof import("@waline/client")> {
	if (!walineModulePromise) {
		walineModulePromise = import("@waline/client");
	}
	return walineModulePromise;
}

function loadWalineStyleUrl(): Promise<string> {
	if (!walineStyleUrlPromise) {
		walineStyleUrlPromise = import("@waline/client/style?url").then(
			(module) => module.default,
		);
	}
	return walineStyleUrlPromise;
}

async function ensureWalineStyles(): Promise<void> {
	const walineStyleUrl = await loadWalineStyleUrl();
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

async function initWaline(root: Element): Promise<void> {
	if (!(root instanceof HTMLElement) || initializedRoots.has(root)) {
		return;
	}

	const gate = root.querySelector<HTMLElement>("[data-waline-gate]");
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

	const [{ init }] = await Promise.all([loadWalineModule(), ensureWalineStyles()]);
	container.classList.remove("hidden");
	if (gate instanceof HTMLElement) {
		gate.classList.add("hidden");
	}

	init({
		el: container,
		serverURL,
		...restOptions,
	});
	initializedRoots.add(root);
}

function observeWaline(root: Element): void {
	if (!(root instanceof HTMLElement) || initializedRoots.has(root)) {
		return;
	}

	const loadStrategy = root.dataset.loadStrategy ?? "click";
	const trigger = root.querySelector<HTMLButtonElement>("[data-waline-trigger]");
	if (loadStrategy === "click") {
		trigger?.addEventListener(
			"click",
			() => {
				void initWaline(root);
			},
			{ once: true },
		);
		return;
	}

	if (!("IntersectionObserver" in window)) {
		void initWaline(root);
		return;
	}

	const observer = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (!entry.isIntersecting) {
					continue;
				}
				observer.disconnect();
				void initWaline(root);
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
