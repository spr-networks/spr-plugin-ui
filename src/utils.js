// Humanize an RFC3339 timestamp, returning null for anything that isn't a real
// time — empty, unparseable, or Go's zero value (0001-01-01T00:00:00Z), which
// backends use for "never". Callers render null as an em dash.
export const timeAgo = (ts) => {
  if (!ts) return null
  const then = Date.parse(ts)
  if (Number.isNaN(then)) return null
  const secs = Math.floor((Date.now() - then) / 1000)
  if (secs < 0) return 'just now' // clock skew / future stamp
  if (secs > 60 * 60 * 24 * 3650) return null // >~10y ago → treat as never
  if (secs < 60) return `${secs}s ago`
  if (secs < 3600) return `${Math.floor(secs / 60)}m ago`
  if (secs < 86400) return `${Math.floor(secs / 3600)}h ago`
  return `${Math.floor(secs / 86400)}d ago`
}
