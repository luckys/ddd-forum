export type LaravelPaginationMeta = {
  current_page: number
  from: number
  last_page: number
  path: string
  per_page: number
  to: number
  total: number
  prev_page_url: string | null
  next_page_url: string | null
}

export type LaravelPaginationResponse<T> = {
  data: T[]
  meta: LaravelPaginationMeta
}

export function buildLaravelPaginationResponse<T>(
  items: T[],
  total: number,
  page: number,
  perPage: number,
  url: URL,
  keepQuery: Record<string, string | string[] | undefined>
): LaravelPaginationResponse<T> {
  const lastPage = perPage > 0 ? Math.max(1, Math.ceil(total / perPage)) : 1
  const current = Math.min(Math.max(1, page || 1), lastPage)
  const from = total === 0 ? 0 : (current - 1) * perPage + 1
  const to = total === 0 ? 0 : Math.min(total, current * perPage)

  const base = new URL(url.toString())

  const buildUrl = (p: number | null) => {
    if (!p) return null
    const u = new URL(base.toString())
    Object.entries(keepQuery).forEach(([k, v]) => {
      if (typeof v === 'string') u.searchParams.set(k, v)
      if (Array.isArray(v)) v.forEach(val => u.searchParams.append(k, val))
    })
    u.searchParams.set('pageNumber', String(p))
    u.searchParams.set('pageSize', String(perPage))
    return u.toString()
  }

  const prev = current > 1 ? buildUrl(current - 1) : null
  const next = current < lastPage ? buildUrl(current + 1) : null

  return {
    data: items,
    meta: {
      current_page: current,
      from,
      last_page: lastPage,
      path: `${base.origin}${base.pathname}`,
      per_page: perPage,
      to,
      total,
      prev_page_url: prev,
      next_page_url: next,
    }
  }
}
