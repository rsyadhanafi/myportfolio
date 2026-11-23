import 'server-only'
import { unstable_cache } from 'next/cache'
import { getPayloadClient } from '@/lib/payload'
import { PROJECTS_CACHE_TAG } from '@/hooks/invalidatePortfolioCache'
import type { Media } from '@/payload-types'

export type ProjectRoom = 'ai' | 'software' | 'design'

export type ProjectItem = {
  id: string
  room: ProjectRoom
  index: string
  title: string
  kicker: string
  description: string
  tags: string[]
  metric?: string
  accent: string
  visual: string
  coverUrl?: string
  coverAlt?: string
  gallery?: Array<{
    url: string
    alt: string
    caption?: string
  }>
  liveUrl?: string
  repoUrl?: string
}

export const getProjectsData = unstable_cache(
  async (): Promise<ProjectItem[]> => {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'projects',
      overrideAccess: false,
      depth: 1,
      pagination: false,
      sort: 'index',
    })

    return result.docs.map((doc) => {
    const rawGallery = Array.isArray((doc as any).galleryImages) ? (doc as any).galleryImages : []
      const gallery = rawGallery
        .map((item: any) => {
          const img = item?.image && typeof item.image === 'object' ? (item.image as Media) : null
          if (!img?.url) return null
          return {
            url: img.url,
            alt: img.alt || item.caption || doc.title,
            caption: item.caption || undefined,
          }
        })
        .filter(Boolean)

      const media = doc.coverImage && typeof doc.coverImage === 'object' ? (doc.coverImage as Media) : null
      return {
        id: String(doc.id),
        room: doc.room as ProjectRoom,
        index: doc.index,
        title: doc.title,
        kicker: doc.kicker,
        description: doc.description,
        tags: (doc.tags ?? []).map((t) => t.name),
        metric: doc.metric ?? undefined,
        accent: doc.accent || '#dfe8ff',
        visual: doc.visual || 'network',
        coverUrl: media?.url ?? undefined,
        coverAlt: media?.alt ?? doc.title,
        liveUrl: doc.liveUrl ?? undefined,
        repoUrl: doc.repoUrl ?? undefined,
        gallery: gallery ?? undefined,
      }
    })
  },
  ['portfolio-projects', 'schema-v1'],
  { tags: [PROJECTS_CACHE_TAG] },
)