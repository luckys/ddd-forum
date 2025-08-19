import { Paginator } from "~~/server/contexts/shared/application/pagination/Paginator"
import { PagePosition } from './PagePosition'
import { PageTotals } from './PageTotals'
import { PageLinks } from './PageLinks'
import { PaginationMeta } from './PaginationMeta'
import type { PaginationResponsePrimitives } from './PaginationTypes'

export class HttpPaginationPresenter {
  build<T>(
    items: T[],
    total: number,
    page: number,
    perPage: number,
    url: URL,
    keepQuery: Record<string, string | string[] | undefined>
  ): PaginationResponsePrimitives<T> {
    const calc = new Paginator().compute(total, page, perPage)
    const base = new URL(url.toString())
    const buildUrl = (p: number | null) => {
      if (!p) return null
      const u = new URL(base.toString())
      Object.entries(keepQuery).forEach(([k, v]) => {
        if (typeof v === 'string') u.searchParams.set(k, v)
        if (Array.isArray(v)) v.forEach(val => u.searchParams.append(k, val))
      })
      u.searchParams.set('pageNumber', String(p))
      u.searchParams.set('pageSize', String(calc.perPage))
      return u.toString()
    }
    const prev = calc.current > 1 ? buildUrl(calc.current - 1) : null
    const next = calc.current < calc.lastPage ? buildUrl(calc.current + 1) : null
    const position = new PagePosition(calc.current, calc.from, calc.to)
    const totals = new PageTotals(calc.perPage, calc.total, calc.lastPage)
    const links = new PageLinks(`${base.origin}${base.pathname}`, prev, next)
    const meta = new PaginationMeta(position, totals, links)
    return { data: items, meta: meta.toPrimitives() }
  }
}
