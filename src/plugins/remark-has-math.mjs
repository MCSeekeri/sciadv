import { visit } from "unist-util-visit";

export function remarkHasMath() {
	return (tree, { data }) => {
		let hasMath = false;
		visit(tree, (node) => {
			if (node.type === "math" || node.type === "inlineMath") {
				hasMath = true;
				return false;
			}
			return undefined;
		});
		data.astro.frontmatter.hasMath = hasMath;
	};
}
