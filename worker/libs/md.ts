type ClassOptions = {
	blockquote?: string;
	br?: string;
	code?: string;
	codeBlock?: string;
	em?: string;
	heading?: {
		h1?: string;
		h2?: string;
		h3?: string;
		h4?: string;
		h5?: string;
		h6?: string;
	};
	hr?: string;
	image?: string;
	link?: string;
	list?: {
		li?: string;
		ol?: string;
		ul?: string;
	};
	paragraph?: string;
	strikethrough?: string;
	strong?: string;
};

export const DEFAULT_OPTIONS: ClassOptions = {
	paragraph: 'text-gray-800 text-lg leading-relaxed mb-6 max-w-prose',
	strong: 'font-semibold text-gray-900',
	em: 'italic text-gray-800',
	strikethrough: 'line-through text-gray-600',
	heading: {
		h1: 'text-3xl font-bold mt-12 mb-6 text-gray-900 tracking-tight',
		h2: 'text-2xl font-bold mt-10 mb-4 text-gray-900 tracking-tight',
		h3: 'text-xl font-bold mt-8 mb-3 text-gray-900',
		h4: 'text-lg font-bold mt-6 mb-2 text-gray-900',
		h5: 'text-base font-bold mt-4 mb-2 text-gray-900',
		h6: 'text-base italic font-semibold mt-4 mb-2 text-gray-700'
	},
	blockquote:
		'pl-5 italic border-l-4 border-gray-300 my-6 text-gray-700 py-1',
	hr: 'my-10 border-t border-gray-200',
	list: {
		ul: 'list-disc pl-8 mb-6 text-lg text-gray-800 leading-relaxed',
		ol: 'list-decimal pl-8 mb-6 text-lg text-gray-800 leading-relaxed',
		li: 'mb-2'
	},
	code: 'font-mono bg-gray-100 px-1.5 py-0.5 rounded text-pink-600 text-sm',
	codeBlock:
		'font-mono bg-gray-100 p-4 rounded overflow-x-auto text-gray-800 my-6 text-sm leading-relaxed',
	br: 'my-4',
	link: 'text-blue-600 hover:underline',
	image: 'max-w-full h-auto rounded my-6'
};

class MarkdownParser {
	private options: ClassOptions;
	private htmlRegex = /<[^>]+>[\s\S]*?<\/[^>]+>|<[^/>]+\/>/g;

	// Regex patterns for markdown elements
	private patterns = {
		heading: /^(#{1,6})\s+(.*?)(?:\s+#+)?$/gm,
		blockquote: /^>\s+(.*?)$/gm,
		unorderedList: /^[\*\-\+]\s+(.*?)$/gm,
		orderedList: /^(\d+)[\.\)]\s+(.*?)$/gm,
		codeBlock: /```([a-z]*)\n([\s\S]*?)```/gm,
		inlineCode: /`([^`]+)`/g,
		hr: /^(?:[\*\-_]\s*){3,}$/gm,
		link: /\[([^\]]+)\]\(([^)]+)\)/g,
		image: /!\[([^\]]*)\]\(([^)]+)\)/g,
		strong: /\*\*([^*]+)\*\*|\b__([^_]+)__\b/g,
		em: /\*([^*]+)\*|\b_([^_]+)_\b/g,
		strikethrough: /~~([^~]+)~~/g,
		paragraph:
			/^(?!<[^>]+>|#{1,6}\s|>\s|\*\s|-\s|\+\s|\d+[.)\s]|```|(?:[\*\-_]\s*){3,})(.*?)$/gm,
		br: /  $/gm
	};

	constructor(options: ClassOptions = {}) {
		this.options = { ...DEFAULT_OPTIONS, ...options };
	}

	private escapeHtml(text: string): string {
		return text
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;')
			.replace(/'/g, '&#039;');
	}

	private sanitizeHtml(html: string): string {
		// Basic HTML sanitization
		// This is a simple implementation - in production, consider a more robust solution
		const allowedTags = [
			'a',
			'b',
			'blockquote',
			'br',
			'code',
			'del',
			'div',
			'em',
			'h1',
			'h2',
			'h3',
			'h4',
			'h5',
			'h6',
			'hr',
			'i',
			'img',
			'li',
			'ol',
			'p',
			'pre',
			'span',
			'strong',
			'table',
			'tbody',
			'td',
			'th',
			'thead',
			'tr',
			'ul'
		];

		// Pattern to match tags
		const tagPattern = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi;

		return html.replace(tagPattern, (match, tag) => {
			const tagLower = tag.toLowerCase();
			if (allowedTags.includes(tagLower)) {
				// Keep the tag but remove potentially dangerous attributes
				// We need to preserve class attributes that were added by our parser
				const cleanedTag = match.replace(
					/(on\w+|style|id)="[^"]*"/gi,
					''
				);

				// Apply appropriate classes to HTML tags that match our markdown elements
				if (!cleanedTag.includes('class="') && this.options) {
					let classToAdd = '';

					switch (tagLower) {
						case 'blockquote':
							classToAdd = this.options.blockquote || '';
							break;
						case 'br':
							classToAdd = this.options.br || '';
							break;
						case 'code':
							// Check if inside pre (code block) or standalone (inline code)
							// This is a simplification - more robust checking would be needed
							classToAdd = match.includes('</pre>')
								? this.options.codeBlock || ''
								: this.options.code || '';
							break;
						case 'em':
						case 'i':
							classToAdd = this.options.em || '';
							break;
						case 'strong':
						case 'b':
							classToAdd = this.options.strong || '';
							break;
						case 'hr':
							classToAdd = this.options.hr || '';
							break;
						case 'img':
							classToAdd = this.options.image || '';
							break;
						case 'a':
							classToAdd = this.options.link || '';
							break;
						case 'li':
							classToAdd = this.options.list?.li || '';
							break;
						case 'ol':
							classToAdd = this.options.list?.ol || '';
							break;
						case 'ul':
							classToAdd = this.options.list?.ul || '';
							break;
						case 'p':
							classToAdd = this.options.paragraph || '';
							break;
						case 'del':
							classToAdd = this.options.strikethrough || '';
							break;
						case 'h1':
						case 'h2':
						case 'h3':
						case 'h4':
						case 'h5':
						case 'h6':
							const level = tagLower.charAt(1);
							classToAdd =
								this.options.heading?.[
									`h${level}` as keyof typeof this.options.heading
								] || '';
							break;
					}

					if (classToAdd) {
						// Insert class attribute
						return cleanedTag.replace(
							/<([a-z][a-z0-9]*)\b/,
							`<$1 class="${classToAdd}"`
						);
					}
				}

				return cleanedTag;
			}
			return this.escapeHtml(match);
		});
	}

	parse(markdown: string, allowHtml: boolean = true): string {
		// Store HTML blocks
		const htmlBlocks: string[] = [];
		let processedMarkdown = markdown;

		if (allowHtml) {
			// Replace HTML blocks with placeholders
			processedMarkdown = markdown.replace(this.htmlRegex, match => {
				const placeholder = `__HTML_BLOCK_${htmlBlocks.length}__`;
				htmlBlocks.push(match);
				return placeholder;
			});
		}

		// Process markdown transformations
		let html = processedMarkdown;

		// Process code blocks first to avoid processing markdown inside them
		html = this.processCodeBlocks(html);

		// Process block elements
		html = this.processHeadings(html);
		html = this.processBlockquotes(html);
		html = this.processLists(html);
		html = this.processHorizontalRules(html);

		// Process inline elements
		html = this.processLinks(html);
		html = this.processImages(html);
		html = this.processInlineFormatting(html);

		// Process paragraphs (should be done after block elements)
		html = this.processParagraphs(html);

		// Process line breaks
		html = this.processLineBreaks(html);

		// Restore HTML blocks if allowed
		if (allowHtml) {
			htmlBlocks.forEach((block, i) => {
				html = html.replace(
					`__HTML_BLOCK_${i}__`,
					this.sanitizeHtml(block)
				);
			});
		}

		// Add a final pass to ensure all HTML elements have their classes applied
		// This catches elements that might have been missed in earlier processing
		const tagClassMap: Record<string, string> = {
			blockquote: this.options.blockquote || '',
			br: this.options.br || '',
			code: this.options.code || '',
			em: this.options.em || '',
			strong: this.options.strong || '',
			hr: this.options.hr || '',
			img: this.options.image || '',
			a: this.options.link || '',
			li: this.options.list?.li || '',
			ol: this.options.list?.ol || '',
			ul: this.options.list?.ul || '',
			p: this.options.paragraph || '',
			del: this.options.strikethrough || ''
		};

		// Add heading classes
		for (let i = 1; i <= 6; i++) {
			tagClassMap[`h${i}`] =
				this.options.heading?.[
					`h${i}` as keyof typeof this.options.heading
				] || '';
		}

		// Apply classes to any HTML elements that don't already have them
		Object.entries(tagClassMap).forEach(([tag, className]) => {
			if (!className) return;

			// This regex matches tags without class attributes
			const tagRegex = new RegExp(`<${tag}(?![^>]*class=)[^>]*>`, 'g');
			html = html.replace(tagRegex, match => {
				return match.replace(`<${tag}`, `<${tag} class="${className}"`);
			});
		});

		return html;
	}

	private processHeadings(text: string): string {
		return text.replace(this.patterns.heading, (match, hashes, content) => {
			const level = hashes.length;
			const headingClass =
				this.options.heading?.[
					`h${level}` as keyof typeof this.options.heading
				] || '';
			return `<h${level} class="${headingClass}">${content.trim()}</h${level}>`;
		});
	}

	private processBlockquotes(text: string): string {
		return text.replace(this.patterns.blockquote, (match, content) => {
			return `<blockquote class="${this.options.blockquote || ''}">${content.trim()}</blockquote>`;
		});
	}

	private processLists(text: string): string {
		// Process unordered lists - improved pattern to better match list items
		let processed = text.replace(
			/^([\*\-\+]\s+.+)(?:\n(?:[\*\-\+]\s+.+))*$/gm,
			match => {
				const items = match
					.split('\n')
					.map(item => {
						// Process the content first to handle nested formatting
						const content = this.processInlineFormatting(
							item.replace(/^[\*\-\+]\s+/, '').trim()
						);
						return `<li class="${this.options.list?.li || ''}">${content}</li>`;
					})
					.join('');
				return `<ul class="${this.options.list?.ul || ''}">${items}</ul>`;
			}
		);

		// Process ordered lists - improved pattern to better match list items
		processed = processed.replace(
			/^(\d+[\.\)]\s+.+)(?:\n(?:\d+[\.\)]\s+.+))*$/gm,
			match => {
				const items = match
					.split('\n')
					.map(item => {
						// Process the content first to handle nested formatting
						const content = this.processInlineFormatting(
							item.replace(/^\d+[\.\)]\s+/, '').trim()
						);
						return `<li class="${this.options.list?.li || ''}">${content}</li>`;
					})
					.join('');
				return `<ol class="${this.options.list?.ol || ''}">${items}</ol>`;
			}
		);

		return processed;
	}

	private processCodeBlocks(text: string): string {
		return text.replace(
			this.patterns.codeBlock,
			(match, language, code) => {
				return `<pre><code class="${this.options.codeBlock || ''}" ${language ? `data-language="${language}"` : ''}>${this.escapeHtml(code.trim())}</code></pre>`;
			}
		);
	}

	private processHorizontalRules(text: string): string {
		return text.replace(this.patterns.hr, () => {
			return `<hr class="${this.options.hr || ''}">`;
		});
	}

	private processLinks(text: string): string {
		return text.replace(this.patterns.link, (match, title, url) => {
			return `<a href="${url}" class="${this.options.link || ''}">${title}</a>`;
		});
	}

	private processImages(text: string): string {
		return text.replace(this.patterns.image, (match, alt, src) => {
			return `<img src="${src}" alt="${alt || ''}" class="${this.options.image || ''}">`;
		});
	}

	private processInlineFormatting(text: string): string {
		// Process strong
		let processed = text.replace(
			this.patterns.strong,
			(match, content1, content2) => {
				const content = content1 || content2;
				return `<strong class="${this.options.strong || ''}">${content}</strong>`;
			}
		);

		// Process emphasis
		processed = processed.replace(
			this.patterns.em,
			(match, content1, content2) => {
				const content = content1 || content2;
				return `<em class="${this.options.em || ''}">${content}</em>`;
			}
		);

		// Process inline code
		processed = processed.replace(
			this.patterns.inlineCode,
			(match, content) => {
				return `<code class="${this.options.code || ''}">${this.escapeHtml(content)}</code>`;
			}
		);

		// Process strikethrough
		processed = processed.replace(
			this.patterns.strikethrough,
			(match, content) => {
				return `<del class="${this.options.strikethrough || ''}">${content}</del>`;
			}
		);

		return processed;
	}

	private processParagraphs(text: string): string {
		return text.replace(this.patterns.paragraph, (match, content) => {
			if (content.trim() === '') {
				return '';
			}

			return `<p class="${this.options.paragraph || ''}">${content.trim()}</p>`;
		});
	}

	private processLineBreaks(text: string): string {
		return text.replace(this.patterns.br, () => {
			return `<br class="${this.options.br || ''}">`;
		});
	}
}

const parse = (md: string, options?: ClassOptions) => {
	const parser = new MarkdownParser(options);

	return parser.parse(md);
};

export default parse;
