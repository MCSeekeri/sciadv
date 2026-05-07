function initSearch() {
	const root = document.getElementById("search-root");

	if (!(root instanceof HTMLElement) || root.dataset.initialized === "true") {
		return;
	}

	root.dataset.initialized = "true";

	const pagefindScriptUrl = root.dataset.pagefindScriptUrl;
	const loadingLabel = root.dataset.loadingLabel ?? "Loading search...";
	const emptyLabel = root.dataset.emptyLabel ?? "No results found.";
	const unavailableLabel =
		root.dataset.unavailableLabel ?? "Search is unavailable right now.";
	const isProd = root.dataset.isProd === "true";
	const desktopInput = document.getElementById("search-input-desktop");
	const mobileInput = document.getElementById("search-input-mobile");
	const searchSwitch = document.getElementById("search-switch");
	const panel = document.getElementById("search-panel");
	const results = document.getElementById("search-results");
	const status = document.getElementById("search-status");
	const syncTargets = [desktopInput, mobileInput].filter(
		(input) => input instanceof HTMLInputElement,
	);
	let searchTimer = 0;
	let latestRequestId = 0;

	const escapeHtml = (value) =>
		value
			.replaceAll("&", "&amp;")
			.replaceAll("<", "&lt;")
			.replaceAll(">", "&gt;")
			.replaceAll('"', "&quot;")
			.replaceAll("'", "&#39;");

	const setPanelOpen = (open) => {
		panel?.classList.toggle("float-panel-closed", !open);
	};

	const setStatus = (message) => {
		if (!status) return;
		status.textContent = message;
		status.classList.toggle("hidden", message.length === 0);
	};

	const clearResults = () => {
		if (results) {
			results.innerHTML = "";
		}
		setStatus("");
	};

	const ensurePagefindLoaded = async () => {
		if (!isProd || !pagefindScriptUrl) {
			return false;
		}

		if (window.pagefind?.search) {
			return true;
		}

		if (!window.__pagefindLoadPromise) {
			window.__pagefindLoadPromise = import(pagefindScriptUrl)
				.then(async (pagefind) => {
					if (typeof pagefind.options === "function") {
						await pagefind.options({ excerptLength: 20 });
					}
					window.pagefind = pagefind;
					return pagefind;
				})
				.catch((error) => {
					console.error("Failed to load Pagefind:", error);
					window.__pagefindLoadPromise = undefined;
					throw error;
				});
		}

		try {
			await window.__pagefindLoadPromise;
			return !!window.pagefind?.search;
		} catch {
			return false;
		}
	};

	const renderResults = (items) => {
		if (!results) return;
		results.innerHTML = items
			.map(
				(item) => `
					<a
						href="${escapeHtml(item.url)}"
						class="transition first-of-type:mt-2 lg:first-of-type:mt-0 group block
	       rounded-xl text-lg px-3 py-2 hover:bg-[var(--btn-plain-bg-hover)] active:bg-[var(--btn-plain-bg-active)]"
					>
						<div class="transition text-90 inline-flex font-bold group-hover:text-[var(--primary)]">
							${escapeHtml(item.meta.title)}
							<span class="transition text-[0.75rem] translate-x-1 my-auto text-[var(--primary)]">&rsaquo;</span>
						</div>
						<div class="transition text-sm text-50">${item.excerpt ?? ""}</div>
					</a>
				`,
			)
			.join("");
	};

	const performSearch = async (rawQuery) => {
		const query = rawQuery.trim();
		const requestId = ++latestRequestId;

		if (!query) {
			clearResults();
			setPanelOpen(false);
			return;
		}

		setPanelOpen(true);
		setStatus(loadingLabel);

		const ready = await ensurePagefindLoaded();
		if (requestId !== latestRequestId) {
			return;
		}

		if (!ready || !window.pagefind?.search) {
			if (results) {
				results.innerHTML = "";
			}
			setStatus(unavailableLabel);
			return;
		}

		try {
			const response = await window.pagefind.search(query);
			const items = await Promise.all(
				response.results.slice(0, 8).map((item) => item.data()),
			);

			if (requestId !== latestRequestId) {
				return;
			}

			if (items.length === 0) {
				if (results) {
					results.innerHTML = "";
				}
				setStatus(emptyLabel);
				return;
			}

			setStatus("");
			renderResults(items);
		} catch (error) {
			console.error("Search error:", error);
			if (results) {
				results.innerHTML = "";
			}
			setStatus(unavailableLabel);
		}
	};

	const queueSearch = (value) => {
		window.clearTimeout(searchTimer);
		searchTimer = window.setTimeout(() => {
			void performSearch(value);
		}, 120);
	};

	const syncInputs = (source, nextValue) => {
		for (const input of syncTargets) {
			if (input !== source) {
				input.value = nextValue;
			}
		}
	};

	const handleInput = (event) => {
		const source = event.currentTarget;
		if (!(source instanceof HTMLInputElement)) return;
		syncInputs(source, source.value);
		queueSearch(source.value);
	};

	const warmSearch = () => {
		void ensurePagefindLoaded();
	};

	desktopInput?.addEventListener("focus", warmSearch, { once: true });
	desktopInput?.addEventListener("input", handleInput);
	mobileInput?.addEventListener("focus", warmSearch, { once: true });
	mobileInput?.addEventListener("input", handleInput);

	searchSwitch?.addEventListener("click", () => {
		const shouldOpen = panel?.classList.contains("float-panel-closed") ?? true;
		setPanelOpen(shouldOpen);
		if (shouldOpen && mobileInput instanceof HTMLInputElement) {
			mobileInput.focus();
			warmSearch();
			if (mobileInput.value.trim()) {
				queueSearch(mobileInput.value);
			}
		}
	});

	document.addEventListener("keydown", (event) => {
		if (event.key === "Escape") {
			setPanelOpen(false);
		}
	});
}

initSearch();
