import { revalidatePath, revalidateTag } from 'next/cache'
import type { PayloadRequest } from 'payload'

export const STORY_CACHE_TAG = 'portfolio-story-milestones'

export function invalidateStoryCache(req: PayloadRequest) {
  try {
    revalidateTag(STORY_CACHE_TAG, { expire: 0 })
    revalidatePath('/')
  } catch (error) {
    const message = error instanceof Error ? error.message : ''
    if (
      message.includes('static generation store missing') ||
      message.includes('incrementalCache missing')
    ) {
      req.payload.logger.warn(
        'Story saved outside the Next runtime; the running site cache was not invalidated by this CLI process.',
      )
      return
    }
    throw error
  }
}