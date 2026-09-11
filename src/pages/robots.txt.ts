import { CONTENT_SIGNAL_DIRECTIVE } from "@utils/agent-readiness";
import type { APIRoute } from "astro";

export const GET: APIRoute = (context) => {
	const site = context.site ?? new URL("https://lib.sci-adv.org");
	const robotsTxt = `
User-agent: *
Disallow: /_astro/
Disallow: /pagefind/
Content-Signal: ${CONTENT_SIGNAL_DIRECTIVE}

Sitemap: ${new URL("sitemap-index.xml", site).href}
`.trim();
	return new Response(robotsTxt, {
		headers: {
			"Content-Type": "text/plain; charset=utf-8",
		},
	});
};
