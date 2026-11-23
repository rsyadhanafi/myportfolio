import 'server-only'
import { unstable_cache } from 'next/cache'
import { getPayloadClient } from '@/lib/payload'
import { TALKS_CACHE_TAG } from '@/hooks/invalidatePortfolioCache'

export type TalkItem = {
  id: string
  number: string
  year: string
  type: string
  title: string
  place: string
}

export const getTalksData = unstable_cache(
  async (): Promise<TalkItem[]> => {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'talks',
      overrideAccess: false,
      depth: 0,
      pagination: false,
      sort: ['-year', 'number'],
    })

    return result.docs.map((doc) => ({
      id: String(doc.id),
      number: doc.number,
      year: doc.year,
      type: doc.type,
      title: doc.title,
      place: doc.place,
    }))
  },
  ['portfolio-talks', 'schema-v1'],
  { tags: [TALKS_CACHE_TAG] },
)