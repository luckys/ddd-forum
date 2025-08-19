// @vitest-environment node
import { describe, it, expect, beforeAll } from 'vitest'
import { setup, $fetch } from '@nuxt/test-utils'
import { randomUUID } from 'node:crypto'
import { execSync } from 'node:child_process'

await setup({
  server: true,
  browser: false,
  nuxtConfig: {
    runtimeConfig: {},
  }
})

describe('Categories API E2E', () => {
  const dbPath = './data/forum.test.sqlite'
  const base = '/api/v1/categories'
  const id = randomUUID()
  const name = `Cat-${id.slice(0, 8)}`
  const description = 'E2E category'

  beforeAll(() => {
    process.env.DATABASE_FILE = dbPath
    process.env.NODE_ENV = 'test'
    execSync(`DATABASE_FILE=${dbPath} NODE_ENV=test node server/database/migrate.mjs`, { stdio: 'inherit' })
  })

  it('creates a category', async () => {
    const res = await $fetch<{ ok: boolean }>(base, {
      method: 'POST',
      body: { id, name, description }
    })
    expect(res.ok).toBe(true)
  })

  it('lists categories and includes the created one', async () => {
    const res = await $fetch<{ data: Array<{ id: string; name: string; description: string | null }>; meta: any }>(base)
    const found = res.data.find(c => c.id === id)
    expect(found?.name).toBe(name)
  })

  it('gets a category by id', async () => {
    const res = await $fetch<{ id: string; name: string; description: string | null }>(`${base}/${id}`)
    expect(res.id).toBe(id)
    expect(res.name).toBe(name)
  })

  it('deletes a category', async () => {
    const res = await $fetch<{ ok: boolean }>(`${base}/${id}`, { method: 'DELETE' })
    expect(res.ok).toBe(true)
  })

  it('returns 404 after deletion', async () => {
    await expect($fetch(`${base}/${id}`)).rejects.toMatchObject({ statusCode: 404 })
  })
})
