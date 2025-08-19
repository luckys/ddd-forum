export type NormalizedQuery = Record<string, string | string[] | undefined>

export function normalizeQueryParams(raw: Record<string, unknown>): NormalizedQuery {
  const query: NormalizedQuery = {}
  for (const [k, v] of Object.entries(raw)) {
    if (typeof v === 'string') query[k] = v
    if (Array.isArray(v)) query[k] = v.filter((x): x is string => typeof x === 'string')
  }
  return query
}
