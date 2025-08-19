import { defineEventHandler, createError, getRouterParam } from 'h3'
import { container } from "~~/server/contexts/shared/infrastructure/dependency-injection/diod.config"
import { ThreadFinder } from "~~/server/contexts/forum/threads/application/find/ThreadFinder"
import { ThreadId } from "~~/server/contexts/forum/threads/domain/ThreadId"
import { ThreadNotFoundError } from "~~/server/contexts/forum/threads/domain/ThreadNotFoundError"

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'id is required' })

  const finder = container.get(ThreadFinder)
  try {
    const thread = await finder.execute(new ThreadId(id))
    return thread.toPrimitives()
  } catch (error) {
    if (error instanceof ThreadNotFoundError) {
      throw createError({ statusCode: 404, statusMessage: error.message })
    }
    throw error
  }
})
