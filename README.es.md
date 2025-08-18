# DDD Forum — Nuxt + Drizzle + Vitest

Proyecto de foro con Nuxt 4 aplicando Domain-Driven Design (DDD) al estilo Codely. La API vive en `server/` y la aplicación en `app/`. Persistencia con Drizzle ORM y SQLite (better-sqlite3). La paginación se implementa con pequeños value objects y un builder orientado a objetos, devolviendo una respuesta con metadatos.

## Stack
- Nuxt 4 (Nitro + Vite)
- TypeScript
- Drizzle ORM + better-sqlite3 (SQLite)
- diod (Inversión de Dependencias)
- Vitest (tests)

## Arquitectura (DDD)
- Organización por bounded contexts en `server/contexts/`.
- Cada agregado contiene capas `domain`, `application` e `infrastructure`.
- Service Providers por bounded context que registran implementaciones en un contenedor DI compartido.
- Value Objects, Aggregates, Repositories y Use Cases como piezas principales.

### Bounded Contexts
- `server/contexts/forum/`
  - `categories/`
    - `domain/`: agregado Category, eventos y errores de dominio, interfaz `CategoryRepository`
    - `application/`: casos de uso (por ejemplo, `CategoryPaginator`)
    - `infrastructure/`: `DrizzleCategoryRepository`, `CategoryServiceProvider`
  - `threads/`
    - `domain/`: agregado Thread, eventos y errores de dominio, interfaz `ThreadRepository`
    - `application/`: casos de uso (por ejemplo, `ThreadPaginator`)
    - `infrastructure/`: `DrizzleThreadRepository`, `ThreadServiceProvider`
- `server/contexts/shared/`
  - Infraestructura compartida (cliente Drizzle, Event Bus, contenedor DI)

### Contenedor de dependencias
- Config principal: `server/contexts/shared/infrastructure/dependency-injection/diod.config.ts`.
- Proveedores por contexto:
  - `CategoryServiceProvider`
  - `ThreadServiceProvider`
- Consumo de dependencias: `container.get(MyUseCase)` desde rutas y servicios.

## Base de datos y Drizzle
- Cliente SQLite: `better-sqlite3`.
- Esquema: `server/database/schema.ts`.
- Migraciones generadas con drizzle-kit y aplicadas mediante el migrator de Drizzle.
- Runner de migraciones: `server/database/migrate.mjs`.

### Scripts útiles
```bash
# Instalar dependencias
npm install

# Dev server
npm run dev

# Tests
npm run test

# Generar migraciones desde schema.ts
npm run db:generate

# Aplicar migraciones a forum.sqlite
npm run db:migrate
```

### Variables de entorno
- `DATABASE_FILE`: ruta del archivo SQLite. Por defecto `forum.sqlite` en la raíz.

## Paginación (OOP)
La paginación se implementa con pequeños value objects y un builder que compone la respuesta final.

- Builder: `server/routes/shared/pagination/PaginationBuilder.ts`
- Tipos: `server/routes/shared/pagination/PaginationTypes.ts`
- Value Objects: `PagePosition`, `PageTotals`, `PageLinks`

Uso en endpoints:
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

Estructura de la respuesta:
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

## Endpoints API
- `GET /api/v1/categories` con query: `pageNumber`, `pageSize`, y filtros/orden soportados por `Criteria`.
- `GET /api/v1/threads` con query: `pageNumber`, `pageSize`, y filtros/orden soportados por `Criteria`.

Ambos devuelven `PaginationResponsePrimitives<T>` con `data` serializado mediante `toPrimitives()` de cada agregado.

## Ejemplos de Criteria
El helper `parseCriteriaFromEvent()` en `server/routes/shared/criteria.ts` soporta tanto un filtro simple mediante `field`, `operator`, `value` como múltiples filtros vía un array `filters` codificado en JSON. También soporta ordenación y paginación.

- Filtro simple (field/operator/value):
  - `?field=name&operator=CONTAINS&value=foo`

- Múltiples filtros (array JSON codificado):
  - `?filters=%5B%7B%22field%22%3A%22name%22%2C%22operator%22%3A%22CONTAINS%22%2C%22value%22%3A%22foo%22%7D%2C%7B%22field%22%3A%22status%22%2C%22operator%22%3A%22EQUAL%22%2C%22value%22%3A%22published%22%7D%5D`
  - Ejemplo decodificado:
    ```json
    [
      { "field": "name", "operator": "CONTAINS", "value": "foo" },
      { "field": "status", "operator": "EQUAL", "value": "published" }
    ]
    ```

- Ordenación:
  - `?orderBy=createdAt&orderType=DESC`

- Paginación:
  - `?pageNumber=2&pageSize=20`

- Ejemplo completo:
  - `/api/v1/categories?filters=%5B%7B%22field%22%3A%22name%22%2C%22operator%22%3A%22CONTAINS%22%2C%22value%22%3A%22foo%22%7D%5D&orderBy=createdAt&orderType=DESC&pageNumber=2&pageSize=20`

### Operadores soportados
Desde `server/contexts/shared/domain/criteria/FilterOperator.ts`:

| Token operador   | Significado        | Ejemplo de query                                  |
|------------------|--------------------|---------------------------------------------------|
| `EQUAL`          | Igual              | `?field=status&operator=EQUAL&value=published`    |
| `NOT_EQUAL`      | Distinto           | `?field=status&operator=NOT_EQUAL&value=draft`    |
| `GT`             | Mayor que          | `?field=views&operator=GT&value=100`              |
| `LT`             | Menor que          | `?field=views&operator=LT&value=10`               |
| `CONTAINS`       | Contiene subcadena | `?field=name&operator=CONTAINS&value=foo`         |
| `NOT_CONTAINS`   | No contiene        | `?field=name&operator=NOT_CONTAINS&value=bar`     |

## Tests
- Framework: Vitest.
- Ejecución: `npm run test`.
- Ubicación: `tests/contexts/...`, reflejando los bounded contexts.
- Enfocados en comportamiento para casos de uso y repositorios.

## Estructura del proyecto (resumen)
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

## Guía de desarrollo
1. Modela/ajusta tu dominio en `domain/` (value objects, aggregate, repository interface).
2. Implementa casos de uso en `application/`.
3. Implementa infraestructura (repositorios Drizzle, service providers, rutas) en `infrastructure/`.
4. Genera y aplica migraciones cuando cambie el esquema.
5. Usa `PaginationBuilder` para endpoints de listado con paginación.

## Notas
- Código en TypeScript, sin comentarios en código productivo.
- Aplica SOLID, KISS, YAGNI y estilo Codely.
- Prefiere guard clauses, evita `else`. Value Objects envuelven primitivos con `value` privado y getters.
