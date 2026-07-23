// Rough, preview-only stripping of common Markdown syntax for card
// excerpts -- not a full parser. Full formatting is rendered properly via
// <Markdown> wherever the complete body is shown (e.g. inside the modal).
export function stripMarkdownPreview(markdown: string): string {
  return markdown
    .split("\n\n")[0] // first paragraph/block only
    .replace(/^#+\s+/gm, "")
    .replace(/^[-*]\s+/gm, "")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/\[(.*?)\]\(.*?\)/g, "$1")
    .replace(/\n/g, " ")
    .trim();
}