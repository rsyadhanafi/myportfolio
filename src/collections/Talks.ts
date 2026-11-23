import type { Access, CollectionConfig } from 'payload'
import { invalidatePortfolioCache, TALKS_CACHE_TAG } from '@/hooks/invalidatePortfolioCache'
const editorsOnly: Access = ({ req }) => req.user?.collection === 'admins'

export const Talks: CollectionConfig = {
  slug: 'talks',
  labels: { singular: 'Speaking Session', plural: 'Keynote & Talks' },
  admin: {
    group: 'Portfolio',
    useAsTitle: 'title',
    defaultColumns: ['number', 'title', 'type', 'place', 'year'],
    description: 'Speaking engagements, panels, and workshops for the Keynote Speaker room.',
  },
  access: {
    read: () => true,
    readVersions: editorsOnly,
    create: editorsOnly,
    update: editorsOnly,
    delete: editorsOnly,
  },
  defaultSort: '-year',
  versions: { maxPerDoc: 20 },
  hooks: {
    afterChange: [
      ({ doc, req }) => {
        invalidatePortfolioCache(req, TALKS_CACHE_TAG)
        return doc
      },
    ],
    afterDelete: [
      ({ doc, req }) => {
        invalidatePortfolioCache(req, TALKS_CACHE_TAG)
        return doc
      },
    ],
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'number',
          label: 'Index Number',
          type: 'text',
          required: true,
          admin: { width: '25%', placeholder: '01' },
        },
        {
          name: 'year',
          type: 'text',
          required: true,
          admin: { width: '25%', placeholder: '2026' },
        },
        {
          name: 'type',
          label: 'Session Format',
          type: 'select',
          required: true,
          options: [
            { label: 'KEYNOTE', value: 'KEYNOTE' },
            { label: 'WORKSHOP', value: 'WORKSHOP' },
            { label: 'TALK', value: 'TALK' },
            { label: 'FACILITATION', value: 'FACILITATION' },
            { label: 'PANEL', value: 'PANEL' },
          ],
          admin: { width: '50%' },
        },
      ],
    },
    { name: 'title', label: 'Topic / Talk Title', type: 'text', required: true },
    { name: 'place', label: 'Event / Venue', type: 'text', required: true },
  ],
}