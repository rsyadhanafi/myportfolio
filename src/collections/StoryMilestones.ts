import type { Access, CollectionConfig } from 'payload'
import { invalidateStoryCache } from '@/hooks/invalidateStoryCache'

const editorsOnly: Access = ({ req }) => req.user?.collection === 'admins'

export const StoryMilestones: CollectionConfig = {
  slug: 'story-milestones',
  labels: { singular: 'Story milestone', plural: 'My Story' },
  admin: {
    group: 'Portfolio',
    useAsTitle: 'title',
    defaultColumns: ['title', 'year', 'dateRange', 'updatedAt'],
    description: 'Your public timeline, newest experience first. Only CMS editors can change it.',
  },
  access: {
    read: () => true,
    readVersions: editorsOnly,
    create: editorsOnly,
    update: editorsOnly,
    delete: editorsOnly,
  },
  defaultSort: '-startDate',
  versions: { maxPerDoc: 20 },
  hooks: {
    afterChange: [
      ({ doc, req }) => {
        invalidateStoryCache(req)
        return doc
      },
    ],
    afterDelete: [
      ({ doc, req }) => {
        invalidateStoryCache(req)
        return doc
      },
    ],
  },
  fields: [
    { name: 'title', label: 'Role / milestone', type: 'text', required: true },
    { name: 'organization', label: 'Institution or community', type: 'text', required: true },
    {
      type: 'row',
      fields: [
        {
          name: 'year',
          type: 'number',
          required: true,
          min: 1900,
          max: 2200,
          admin: { width: '25%' },
        },
        {
          name: 'startDate',
          type: 'date',
          required: true,
          admin: { width: '35%', description: 'Controls chronological ordering.' },
        },
        {
          name: 'dateRange',
          label: 'Displayed date range',
          type: 'text',
          required: true,
          admin: { width: '40%', placeholder: 'JAN 2026 — NOW' },
        },
      ],
    },
    {
      name: 'descriptions',
      label: 'Experience highlights',
      type: 'array',
      minRows: 1,
      maxRows: 8,
      required: true,
      fields: [{ name: 'text', type: 'textarea', required: true }],
    },
  ],
}
