# DDD Forum — Nuxt + Drizzle + Vitest

Nuxt 4 forum project applying Domain-Driven Design (DDD) in the style of Codely. The API lives under `server/` and the application under `app/`. Persistence is powered by Drizzle ORM and SQLite (better-sqlite3). Pagination is implemented with small OOP value objects and a builder, returning a metadata-rich response.

## Stack
- Nuxt 4 (Nitro + Vite)
- TypeScript
- Drizzle ORM + better-sqlite3 (SQLite)
- diod (Dependency Injection)
- Vitest (tests)

## Architecture (DDD)
- Organized by bounded contexts under `server/contexts/`.
- Each aggregate module contains `domain`, `application`, and `infrastructure` layers.
- Service Providers per bounded context register concrete implementations into a shared DI container.
- Value Objects, Aggregates, Repositories, and Use Cases are first-class citizens.

### Bounded Contexts
- `server/contexts/forum/`
  - `categories/`
    - `domain/`: Category aggregate, domain events, domain errors, `CategoryRepository` interface
    - `application/`: use cases (e.g., `CategoryPaginator`)
    - `infrastructure/`: `DrizzleCategoryRepository`, `CategoryServiceProvider`
  - `threads/`
    - `domain/`: Thread aggregate, domain events, domain errors, `ThreadRepository` interface
    - `application/`: use cases (e.g., `ThreadPaginator`)
    - `infrastructure/`: `DrizzleThreadRepository`, `ThreadServiceProvider`
- `server/contexts/shared/`
  - Shared infrastructure (Drizzle client, Event Bus, DI container)

### Dependency Injection
- Main config: `server/contexts/shared/infrastructure/dependency-injection/diod.config.ts`.
- Each bounded context exposes a Service Provider:
  - `CategoryServiceProvider`
  - `ThreadServiceProvider`
- Dependencies are consumed with `container.get(MyUseCase)` from routes and services.

## Database and Drizzle
- SQLite client: `better-sqlite3`.
- Schema: `server/database/schema.ts`.
- Migrations generated with drizzle-kit and applied via Drizzle migrator.
- Migration runner: `server/database/migrate.mjs`.

### Useful scripts
```bash
# Install dependencies
npm install

# Dev server
npm run dev

# Tests
npm run test

# Generate migrations from schema.ts
npm run db:generate

# Apply migrations to forum.sqlite
npm run db:migrate
```

### Environment variables
- `DATABASE_FILE`: SQLite file path. Defaults to `forum.sqlite` at project root.

## Pagination (OOP)
Pagination is implemented with small composable value objects and a builder that assembles the final response.

- Builder: `server/routes/shared/pagination/PaginationBuilder.ts`
- Types: `server/routes/shared/pagination/PaginationTypes.ts`
- Value Objects: `PagePosition`, `PageTotals`, `PageLinks`

Endpoint usage:
```ts
import { PaginationBuilder } from "~~/server/routes/shared/pagination/PaginationBuilder"

export default defineEventHandler(async (event) => {
  const criteria = parseCriteriaFromEvent(event)
  const paginator = container.get(CategoryPaginator)
  const { items, total } = await paginator.execute(criteria)

  const url = getRequestURL(event)
  const rawQuery = getQuery(event)
  const query: Record<string, string | string[] | undefined> = {}
  for (const [k, v] of Object.entries(rawQuery)) {
    if (typeof v === 'string') query[k] = v
    if (Array.isArray(v)) query[k] = v.filter((x): x is string => typeof x === 'string')
  }

  const page = criteria.pageNumber ?? 1
  const perPage = criteria.pageSize ?? items.length

  const builder = new PaginationBuilder()
  return builder.build(items.map(c => c.toPrimitives()), total, page, perPage, url, query)
})
```

Pagination response shape:
```ts
export type PaginationResponsePrimitives<T> = {
  data: T[]
  meta: {
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
}
```

## API Endpoints
- `GET /api/v1/categories` with query:
  - `pageNumber`, `pageSize`, plus filters/sorting supported by `Criteria`.
- `GET /api/v1/threads` with query:
  - `pageNumber`, `pageSize`, plus filters/sorting supported by `Criteria`.

Both return `PaginationResponsePrimitives<T>` with `data` serialized via each aggregate’s `toPrimitives()`.

## Tests
- Framework: Vitest.
- Run: `npm run test`.
- Tests live under `tests/contexts/...`, mirroring bounded contexts.
- Focus on behavior-first tests for use cases and repositories.

## Project structure (summary)
```
app/
server/
  contexts/
    forum/
      categories/
        application/
          paginate/
            CategoryPaginator.ts
        domain/
          Category.ts
          CategoryRepository.ts
          ...
        infrastructure/
          DrizzleCategoryRepository.ts
          CategoryServiceProvider.ts
      threads/
        application/
          paginate/
            ThreadPaginator.ts
        domain/
          Thread.ts
          ThreadRepository.ts
          ...
        infrastructure/
          DrizzleThreadRepository.ts
          ThreadServiceProvider.ts
    shared/
      infrastructure/
        dependency-injection/
          diod.config.ts
        drizzle/
          sqlite.ts
  database/
    schema.ts
    migrate.mjs
    migrations/
  routes/
    api/
      v1/
        categories/index.get.ts
        threads/index.get.ts
    shared/
      criteria.ts
      pagination/
        PaginationBuilder.ts
        PaginationTypes.ts
        PagePosition.ts
        PageTotals.ts
        PageLinks.ts
        PaginationMeta.ts
```

## Development guide
1. Model/update your domain in `domain/` (value objects, aggregate, repository interface).
2. Implement use cases in `application/`.
3. Implement infrastructure (Drizzle repositories, service providers, routes) in `infrastructure/`.
4. Generate and apply migrations when schema changes.
5. Use `PaginationBuilder` for list endpoints that need pagination.

## Notes
- Code in TypeScript, no comments in production code.
- Apply SOLID, KISS, YAGNI, and Codely-style design.
- Prefer guard clauses, avoid `else`. Value Objects wrap primitives with a private `value` and getters.
