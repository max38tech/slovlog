import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Image from "next/image";

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="prose prose-slate dark:prose-invert lg:prose-lg max-w-none prose-headings:font-sans prose-headings:font-bold prose-headings:text-slate-900 dark:prose-headings:text-white prose-headings:tracking-tight prose-a:text-slovenia-blue dark:prose-a:text-blue-400 prose-a:font-medium hover:prose-a:underline prose-img:rounded-2xl prose-img:shadow-md prose-blockquote:border-l-4 prose-blockquote:border-slovenia-blue dark:prose-blockquote:border-blue-400 prose-blockquote:bg-slovenia-blue/5 dark:prose-blockquote:bg-blue-950/20 prose-blockquote:py-2 prose-blockquote:px-5 prose-blockquote:rounded-r-xl prose-blockquote:font-normal prose-blockquote:not-italic prose-blockquote:text-slate-700 dark:prose-blockquote:text-slate-200">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          img: ({ src, alt }) => {
            if (!src || typeof src !== "string") return null;
            return (
              <figure className="my-8">
                <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 shadow-md">
                  <Image
                    src={src}
                    alt={alt || "Slovenia travel photo"}
                    fill
                    className="object-cover"
                  />
                </div>
                {alt && (
                  <figcaption className="text-center text-xs text-slate-500 dark:text-slate-400 mt-2.5 font-sans">
                    {alt}
                  </figcaption>
                )}
              </figure>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
