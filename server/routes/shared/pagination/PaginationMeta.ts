import { PagePosition } from './PagePosition'
import { PageTotals } from './PageTotals'
import { PageLinks } from './PageLinks'
import type { PaginationMetaPrimitives } from './PaginationTypes'

export class PaginationMeta {
  constructor(
    private readonly position: PagePosition,
    private readonly totals: PageTotals,
    private readonly links: PageLinks,
  ) {}

  toPrimitives(): PaginationMetaPrimitives {
    return {
      current_page: this.position.currentPage(),
      from: this.position.from(),
      last_page: this.totals.lastPageValue(),
      path: this.links.pathValue(),
      per_page: this.totals.perPageValue(),
      to: this.position.to(),
      total: this.totals.totalValue(),
      prev_page_url: this.links.prevUrl(),
      next_page_url: this.links.nextUrl(),
    }
  }
}
