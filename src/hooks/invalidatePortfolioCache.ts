import { revalidatePath, revalidateTag } from 'next/cache'
import type { PayloadRequest } from 'payload'

export const PROJECTS_CACHE_TAG = 'portfolio-projects'
export const TALKS_CACHE_TAG = 'portfolio-talks'

export function invalidatePortfolioCache(req: PayloadRequest, tag: string) {
  try {
    revalidateTag(tag, { expire: 0 })
    revalidatePath('/')
  } catch (error) {
    const message = error instanceof Error ? error.message : ''
    if (
      message.includes('static generation store missing') ||
      message.includes('incrementalCache missing')
    ) {
      req.payload.logger.warn(
        'Content saved outside the Next runtime; running site cache was not invalidated by this CLI process.',
      )
      return
    }
    throw error
  }
}