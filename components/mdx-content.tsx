import { MDXRemote } from 'next-mdx-remote/rsc'

export function MdxContent({ source }: { source: string }) {
  return (
    <div className="prose prose-invert prose-sm max-w-none prose-headings:font-light prose-a:text-primary prose-code:font-mono">
      <MDXRemote source={source} />
    </div>
  )
}
