interface RichTextRendererOptions {
	linkTarget?: string;
	sanitize?: boolean;
}

export class RichTextRenderer {
	private options: Required<RichTextRendererOptions>;
	private patterns: Record<string, RegExp>;

	constructor(options: RichTextRendererOptions = {}) {
		this.options = {
			linkTarget: options.linkTarget || "_blank",
			sanitize: options.sanitize !== false, // Default to true
		};

		// Common regex patterns
		this.patterns = {
			url: /https?:\/\/[^\s<]+[^<.,:;"')\]\s]/g,
			bold: /\*\*(.*?)\*\*/g,
			italic: /\_(.*?)\_/g,
			strikethrough: /\~\~(.*?)\~\~/g,
			code: /`([^`]+)`/g,
			codeBlock: /```(?:(\w+)\n)?([\s\S]*?)```/g,
			heading: /^(#{1,3})\s+(.+)$/gm,
			list: /^(\s*)[-*]\s+(.+)$/gm,
			quote: /^>\s+(.+)$/gm,
			paragraph: /\n\n+/g, // Multiple newlines for paragraphs
			lineBreak: /\n/g, // Single newlines
		};
	}

	/**
	 * Sanitize HTML to prevent XSS attacks
	 */
	private sanitizeHTML(html: string): string {
		if (!this.options.sanitize) return html;

		const temp = document.createElement("div");
		temp.textContent = html;
		return temp.innerHTML;
	}

	/**
	 * Escape HTML special characters
	 */
	private escapeHTML(text: string): string {
		return text
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/"/g, "&quot;")
			.replace(/'/g, "&#039;");
	}

	/**
	 * Convert plain text to HTML with rich formatting
	 */
	public render(text: string): string {
		if (!text) return "";

		// First escape HTML to prevent XSS
		let html = this.escapeHTML(text);

		// Process code blocks first to avoid formatting within them
		const codeBlocks: string[] = [];
		html = html.replace(
			this.patterns.codeBlock,
			(match: string, language: string, code: string) => {
				const placeholder = `__CODE_BLOCK_${codeBlocks.length}__`;
				const codeHTML = `<pre><code class="language-${
					language || "plain"
				}">${code}</code></pre>`;
				codeBlocks.push(codeHTML);
				return placeholder;
			}
		);

		// Process inline code
		const inlineCodes: string[] = [];
		html = html.replace(this.patterns.code, (match: string, code: string) => {
			const placeholder = `__INLINE_CODE_${inlineCodes.length}__`;
			inlineCodes.push(`<code>${code}</code>`);
			return placeholder;
		});

		// Process other formatting
		html = html
			// Links
			.replace(
				this.patterns.url,
				(url: string) =>
					`<a href="${url}" target="${this.options.linkTarget}" rel="noopener noreferrer">${url}</a>`
			)

			// Bold text
			.replace(
				this.patterns.bold,
				(_match: string, content: string) => `<strong>${content}</strong>`
			)

			// Italic text
			.replace(
				this.patterns.italic,
				(_match: string, content: string) => `<em>${content}</em>`
			)

			// Strikethrough
			.replace(
				this.patterns.strikethrough,
				(_match: string, content: string) => `<del>${content}</del>`
			)

			// Headings
			.replace(
				this.patterns.heading,
				(_match: string, level: string, content: string) => {
					const headingLevel = Math.min(level.length, 3);
					return `<h${headingLevel}>${content}</h${headingLevel}>`;
				}
			)

			// Lists
			.replace(
				this.patterns.list,
				(_match: string, indent: string, content: string) => {
					const indentLevel = indent.length;
					return `<div class="list-item" style="padding-left: ${
						indentLevel * 10
					}px">• ${content}</div>`;
				}
			)

			// Quotes
			.replace(
				this.patterns.quote,
				(_match: string, content: string) =>
					`<blockquote>${content}</blockquote>`
			);

		// Put back code blocks and inline code
		inlineCodes.forEach((code: string, i: number) => {
			html = html.replace(`__INLINE_CODE_${i}__`, code);
		});

		codeBlocks.forEach((block: string, i: number) => {
			html = html.replace(`__CODE_BLOCK_${i}__`, block);
		});

		return html;
	}
}

// Additional utility function exports
export function parseMessage(text: string): string {
	const renderer = new RichTextRenderer();
	return renderer.render(text);
}

export default RichTextRenderer;
