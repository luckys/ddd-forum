export class PageTotals {
  constructor(
    private readonly perPage: number,
    private readonly total: number,
    private readonly lastPage: number,
  ) {}

  perPageValue(): number { return this.perPage }
  totalValue(): number { return this.total }
  lastPageValue(): number { return this.lastPage }
}
