export type PaginatorResult = {
  current: number
  from: number
  to: number
  perPage: number
  total: number
  lastPage: number
}

export class Paginator {
  compute(total: number, page: number, perPage: number): PaginatorResult {
    const safePerPage = perPage > 0 ? perPage : 1
    const lastPage = Math.max(1, Math.ceil(total / safePerPage))
    const requested = page || 1
    const current = Math.min(Math.max(1, requested), lastPage)
    const from = total === 0 ? 0 : (current - 1) * safePerPage + 1
    const to = total === 0 ? 0 : Math.min(total, current * safePerPage)
    return { current, from, to, perPage: safePerPage, total, lastPage }
  }
}
