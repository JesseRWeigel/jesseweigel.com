import { MDXRemote } from 'next-mdx-remote/rsc'

export function MdxContent({ source }: { source: string }) {
  return (
    <div className="mdx-content prose prose-invert max-w-none">
      <MDXRemote source={source} />
    </div>
  )
}
