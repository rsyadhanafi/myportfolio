import 'server-only'
import { unstable_cache } from 'next/cache'
import { getPayloadClient } from '@/lib/payload'
import { STORY_CACHE_TAG } from '@/hooks/invalidateStoryCache'
import type { StoryData } from '@/data/storyData'

export const getStoryData = unstable_cache(
  async (): Promise<StoryData[]> => {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'story-milestones',
      overrideAccess: false,
      depth: 0,
      pagination: false,
      sort: '-startDate',
    })
    return result.docs.map((doc) => ({
      id: doc.id,
      year: String(doc.year),
      start: doc.startDate,
      range: doc.dateRange,
      title: doc.title,
      organization: doc.organization,
      points: (doc.descriptions ?? []).map((point) => point.text),
    }))
  },
  ['portfolio-story', 'schema-v1'],
  { tags: [STORY_CACHE_TAG] },
)
