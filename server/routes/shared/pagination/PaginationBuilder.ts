import { PagePosition } from './PagePosition'
import { PageTotals } from './PageTotals'
import { PageLinks } from './PageLinks'
import { PaginationMeta } from './PaginationMeta'
import type { PaginationResponsePrimitives } from './PaginationTypes'

export class PaginationBuilder {
  build<T>(
    items: T[],
    total: number,
    page: number,
    perPage: number,
    url: URL,
    keepQuery: Record<string, string | string[] | undefined>
  ): PaginationResponsePrimitives<T> {
    const safePerPage = perPage > 0 ? perPage : 1
    const lastPage = Math.max(1, Math.ceil(total / safePerPage))
    const requested = page || 1
    const current = Math.min(Math.max(1, requested), lastPage)
    const from = total === 0 ? 0 : (current - 1) * safePerPage + 1
    const to = total === 0 ? 0 : Math.min(total, current * safePerPage)

    const base = new URL(url.toString())

    const buildUrl = (p: number | null) => {
      if (!p) return null
      const u = new URL(base.toString())
      Object.entries(keepQuery).forEach(([k, v]) => {
        if (typeof v === 'string') u.searchParams.set(k, v)
        if (Array.isArray(v)) v.forEach(val => u.searchParams.append(k, val))
      })
      u.searchParams.set('pageNumber', String(p))
      u.searchParams.set('pageSize', String(safePerPage))
      return u.toString()
    }

    const prev = current > 1 ? buildUrl(current - 1) : null
    const next = current < lastPage ? buildUrl(current + 1) : null

    const position = new PagePosition(current, from, to)
    const totals = new PageTotals(safePerPage, total, lastPage)
    const links = new PageLinks(`${base.origin}${base.pathname}`, prev, next)
    const meta = new PaginationMeta(position, totals, links)

    return { data: items, meta: meta.toPrimitives() }
  }
}
