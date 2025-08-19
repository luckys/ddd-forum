# DDD Forum — Nuxt + Drizzle + Vitest

[🇬🇧 English](./README.md) · [🇪🇸 Español](./README.es.md)

Nuxt 4 forum project applying Domain-Driven Design (DDD) in the style of Codely. The API lives under `server/` and the application under `app/`. Persistence is powered by Drizzle ORM and SQLite (better-sqlite3). Pagination is implemented with small OOP value objects, a presenter, and a shared helper, returning a metadata-rich response.

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
Pagination is implemented with small composable value objects and a presenter that assembles the final response. A shared helper encapsulates the HTTP-specific workflow for list endpoints.

- Presenter: `server/routes/shared/pagination/HttpPaginationPresenter.ts`
- Helper: `server/routes/shared/pagination/buildPaginatedResponse.ts`
- Types: `server/routes/shared/pagination/PaginationTypes.ts`
- Value Objects: `PagePosition`, `PageTotals`, `PageLinks`, `PaginationMeta`

Endpoint usage:
```ts
import { container } from "~~/server/contexts/shared/infrastructure/dependency-injection/diod.config"
import { CategoryPaginator } from "~~/server/contexts/forum/categories/application/paginate/CategoryPaginator"
import { H3Event } from 'h3'
import { buildPaginatedResponse } from "~~/server/routes/shared/pagination/buildPaginatedResponse"

export default defineEventHandler(async (event: H3Event) => {
  const paginator = container.get(CategoryPaginator)
  return buildPaginatedResponse(event, paginator, c => c.toPrimitives())
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

## Criteria examples
The helper `parseCriteriaFromEvent()` in `server/routes/shared/HttpCriteriaParser.ts` supports both a single filter via `field`, `operator`, `value` and multiple filters via a JSON-encoded `filters` array. It also supports ordering and pagination. Query normalization is handled by `server/routes/shared/HttpQueryNormalizer.ts` inside `buildPaginatedResponse`.

- Single filter (field/operator/value):
  - `?field=name&operator=CONTAINS&value=foo`

- Multiple filters (JSON-encoded array):
  - `?filters=%5B%7B%22field%22%3A%22name%22%2C%22operator%22%3A%22CONTAINS%22%2C%22value%22%3A%22foo%22%7D%2C%7B%22field%22%3A%22status%22%2C%22operator%22%3A%22EQUAL%22%2C%22value%22%3A%22published%22%7D%5D`
  - Decoded example:
    ```json
    [
      { "field": "name", "operator": "CONTAINS", "value": "foo" },
      { "field": "status", "operator": "EQUAL", "value": "published" }
    ]
    ```

- Ordering:
  - `?orderBy=createdAt&orderType=DESC`

- Pagination:
  - `?pageNumber=2&pageSize=20`

- Full example:
  - `/api/v1/categories?filters=%5B%7B%22field%22%3A%22name%22%2C%22operator%22%3A%22CONTAINS%22%2C%22value%22%3A%22foo%22%7D%5D&orderBy=createdAt&orderType=DESC&pageNumber=2&pageSize=20`

### Supported operators
From `server/contexts/shared/domain/criteria/FilterOperator.ts`:

| Operator token   | Meaning            | Example query                                     |
|------------------|--------------------|---------------------------------------------------|
| `EQUAL`          | Equals             | `?field=status&operator=EQUAL&value=published`    |
| `NOT_EQUAL`      | Not equals         | `?field=status&operator=NOT_EQUAL&value=draft`    |
| `GT`             | Greater than       | `?field=views&operator=GT&value=100`              |
| `LT`             | Less than          | `?field=views&operator=LT&value=10`               |
| `CONTAINS`       | Substring match    | `?field=name&operator=CONTAINS&value=foo`         |
| `NOT_CONTAINS`   | Not substring      | `?field=name&operator=NOT_CONTAINS&value=bar`     |

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
      HttpCriteriaParser.ts
      HttpQueryNormalizer.ts
      pagination/
        HttpPaginationPresenter.ts
        buildPaginatedResponse.ts
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
5. Use `buildPaginatedResponse` for list endpoints that need pagination.

## Notes
- Code in TypeScript, no comments in production code.
- Apply SOLID, KISS, YAGNI, and Codely-style design.
- Prefer guard clauses, avoid `else`. Value Objects wrap primitives with a private `value` and getters.
