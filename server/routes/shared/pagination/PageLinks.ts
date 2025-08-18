export class PageLinks {
  constructor(
    private readonly path: string,
    private readonly prev: string | null,
    private readonly next: string | null,
  ) {}

  pathValue(): string { return this.path }
  prevUrl(): string | null { return this.prev }
  nextUrl(): string | null { return this.next }
}
