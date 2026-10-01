import type { APIRoute } from "astro";

// AI 使用偏好声明（Cloudflare Content Signals 倡议）：允许搜索与 AI 输入，禁止训练。
const CONTENT_SIGNAL_DIRECTIVE = "ai-train=no, search=yes, ai-input=yes";

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
