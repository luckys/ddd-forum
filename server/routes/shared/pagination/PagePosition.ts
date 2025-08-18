export class PagePosition {
  constructor(
    private readonly current: number,
    private readonly fromValue: number,
    private readonly toValue: number,
  ) {}

  currentPage(): number { return this.current }
  from(): number { return this.fromValue }
  to(): number { return this.toValue }
}
