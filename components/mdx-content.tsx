import { MDXRemote } from 'next-mdx-remote/rsc'

export function MdxContent({ source }: { source: string }) {
  return (
    <div className="prose prose-invert max-w-none prose-headings:font-medium prose-headings:tracking-tight prose-h2:mt-10 prose-h2:mb-4 prose-h2:text-xl prose-h3:mt-8 prose-h3:mb-3 prose-p:my-4 prose-p:leading-relaxed prose-a:text-primary prose-a:underline prose-a:underline-offset-4 prose-a:decoration-primary/40 hover:prose-a:decoration-primary prose-strong:text-foreground prose-code:font-mono prose-code:text-primary/80 prose-li:my-1 prose-ul:my-4 prose-ol:my-4 prose-pre:my-6 prose-blockquote:border-primary/30 prose-blockquote:text-muted-foreground">
      <MDXRemote source={source} />
    </div>
  )
}
