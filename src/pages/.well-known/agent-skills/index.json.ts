import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";
import type { APIRoute } from "astro";

const skillDefinitions = [
	{
		name: "link-headers",
		type: "skill-md",
		description:
			"Discover homepage Link headers that advertise agent-facing resources.",
		urlPath: "/.well-known/agent-skills/link-headers/SKILL.md",
	},
	{
		name: "markdown-negotiation",
		type: "skill-md",
		description:
			"Request Markdown representations of public HTML pages with Accept negotiation.",
		urlPath: "/.well-known/agent-skills/markdown-negotiation/SKILL.md",
	},
	{
		name: "content-signals",
		type: "skill-md",
		description:
			"Read the site's published Content-Signal preferences from robots.txt.",
		urlPath: "/.well-known/agent-skills/content-signals/SKILL.md",
	},
] as const;

export const GET: APIRoute = ({ site }) => {
	const siteUrl = site?.toString() ?? import.meta.env.SITE;
	const body = JSON.stringify(
		{
			$schema: "https://schemas.agentskills.io/discovery/0.2.0/schema.json",
			skills: skillDefinitions.map((skill) => ({
				name: skill.name,
				type: skill.type,
				description: skill.description,
				url: new URL(skill.urlPath, siteUrl).href,
				sha256: `sha256:${readSkillDigest(skill.urlPath)}`,
			})),
		},
		null,
		2,
	);

	return new Response(body, {
		headers: {
			"Content-Type": "application/json; charset=utf-8",
		},
	});
};

function readSkillDigest(publicPath: string): string {
	const filePath = path.join(
		process.cwd(),
		"public",
		publicPath.replace(/^\/+/, ""),
	);
	const fileContent = readFileSync(filePath);
	return createHash("sha256").update(fileContent).digest("hex");
}
