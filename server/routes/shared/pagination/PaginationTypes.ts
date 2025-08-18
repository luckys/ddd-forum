export type PaginationMetaPrimitives = {
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

export type PaginationResponsePrimitives<T> = {
  data: T[]
  meta: PaginationMetaPrimitives
}
