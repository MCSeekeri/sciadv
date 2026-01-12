<script lang="ts">
import type { WalineInitOptions, WalineInstance } from "@waline/client";
import { init } from "@waline/client";
import { onDestroy, onMount } from "svelte";
import "@waline/client/style";

// Basic Config
export let serverURL = "";
export let path = "";
export let lang = "zh-CN";
export let locale: WalineInitOptions["locale"] = undefined;
export let emoji: WalineInitOptions["emoji"] = undefined;
export let dark = "auto";

// Comment Config
export let meta: ("nick" | "mail" | "link")[] = ["nick", "mail", "link"];
export let requiredMeta: ("nick" | "mail")[] = [];
export let login: "enable" | "disable" | "force" = "enable";
export let wordLimit: number | [number, number] = [0, 1000];
export let pageSize = 10;

// Image Upload & Rendering
export let imageUploader: boolean | ((file: File) => Promise<string>) = false;
export let highlighter: ((code: string, lang: string) => string) | undefined =
	undefined;
export let texRenderer:
	| ((blockMode: boolean, tex: string) => string)
	| undefined = undefined;

// Search
export let search: WalineInitOptions["search"] = false;

// Security & Privacy
export let recaptchaV3Key: string | undefined = undefined;
export let turnstileKey: string | undefined = undefined;
export let reaction: boolean | string[] = false;

// UI Config
export let noCopyright = false;
export let commentSorting: "latest" | "oldest" | "hottest" = "latest";

// Advanced
export let avatar: string | undefined = undefined;
export let avatarCDN: string | undefined = undefined;
export let avatarForce = false;
export let uploadImage: ((file: File) => Promise<string>) | undefined =
	undefined;

let walineInstance: WalineInstance | null = null;
let walineContainer: HTMLDivElement;

onMount(() => {
	if (!serverURL) {
		console.warn("Waline serverURL is not configured");
		return;
	}

	const options: WalineInitOptions = {
		el: walineContainer,
		serverURL,
		path,
		lang,
		dark,
		meta,
		requiredMeta,
		login,
		pageSize,
		wordLimit,
		imageUploader,
		search,
		noCopyright,
		...(locale && { locale }),
		...(emoji && { emoji }),
		...(highlighter && { highlighter }),
		...(texRenderer && { texRenderer }),
		...(recaptchaV3Key && { recaptchaV3Key }),
		...(turnstileKey && { turnstileKey }),
		...(reaction !== false && { reaction }),
		...(commentSorting && { commentSorting }),
		...(avatar && { avatar }),
		...(avatarCDN && { avatarCDN }),
		...(avatarForce && { avatarForce }),
		...(uploadImage && { uploadImage }),
	};

	walineInstance = init(options);

	onDestroy(() => {
		walineInstance?.destroy();
	});
});
</script>

<div class="waline-wrapper card-base px-6 md:px-9 pt-6 pb-4 rounded-[var(--radius-large)] onload-animation">
	<div bind:this={walineContainer}></div>
</div>

<style>
  .waline-wrapper {
    --waline-theme-color: var(--primary);
    --waline-active-color: var(--primary);
    --waline-bg-color: var(--card-bg);
    --waline-bg-color-light: var(--btn-plain-bg-hover);
    --waline-info-bg-color: var(--btn-regular-bg);
    --waline-info-color: var(--btn-content);
    --waline-border-color: var(--btn-regular-bg);
    --waline-disable-bg-color: var(--btn-plain-bg-hover);
    --waline-disable-color: var(--btn-content);
  }

  .waline-wrapper :global(.wl-count),
  .waline-wrapper :global([data-waline]) {
    color: rgba(0, 0, 0, 0.75);
  }

  :global(html.dark) .waline-wrapper :global(.wl-count),
  :global(html.dark) .waline-wrapper :global([data-waline]) {
    color: rgba(255, 255, 255, 0.75);
  }
</style>
