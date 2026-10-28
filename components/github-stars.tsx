export function GitHubStars({ count, checkedAt }: { count: number; checkedAt?: string }) {
  // Never present an undated number as a live count.
  if (count <= 0 || !checkedAt || !Number.isFinite(Date.parse(checkedAt))) return null
  const date = new Intl.DateTimeFormat('en-US', {
    month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC',
  }).format(new Date(checkedAt))
  return <> · ★ {count} <small>(as of <time dateTime={checkedAt}>{date}</time>)</small></>
}
