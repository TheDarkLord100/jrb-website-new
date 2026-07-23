import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

// Renders trusted Markdown (site content authored via the Supabase
// Dashboard, not arbitrary user input) as React elements styled to match
// the rest of the site -- never as raw HTML, so there's no injection
// surface to sanitize against. Each element below maps to the same classes
// used elsewhere for body copy; add overrides here (e.g. h2/h3, blockquote,
// code) if a content block ever needs them.
const components: Components = {
  p: ({ children }) => (
    <p className="mt-3 leading-relaxed text-gray-700 first:mt-0">{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="mt-3 list-disc pl-5 text-gray-700 first:mt-0">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="mt-3 list-decimal pl-5 text-gray-700 first:mt-0">{children}</ol>
  ),
  li: ({ children }) => <li className="mt-1 leading-relaxed first:mt-0">{children}</li>,
  strong: ({ children }) => <strong className="font-semibold text-[#001A23]">{children}</strong>,
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-[#001A23] underline underline-offset-2 hover:text-amber-700"
    >
      {children}
    </a>
  ),
};

export default function Markdown({ children }: { children: string }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
      {children}
    </ReactMarkdown>
  );
}