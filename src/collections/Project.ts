import type { Access, CollectionConfig } from 'payload'
import { invalidatePortfolioCache, PROJECTS_CACHE_TAG } from '@/hooks/invalidatePortfolioCache'
const editorsOnly: Access = ({ req }) => req.user?.collection === 'admins'

export const Projects: CollectionConfig = {
  slug: 'projects',
  labels: { singular: 'Project', plural: 'Projects' },
  admin: {
    group: 'Portfolio',
    useAsTitle: 'title',
    defaultColumns: ['title', 'room', 'index', 'metric', 'updatedAt'],
    description: 'Portfolio works shown inside AI, Web Developer, and Graphic Design rooms.',
  },
  access: {
    read: () => true,
    readVersions: editorsOnly,
    create: editorsOnly,
    update: editorsOnly,
    delete: editorsOnly,
  },
  defaultSort: 'index',
  versions: { maxPerDoc: 20 },
  hooks: {
    afterChange: [
      ({ doc, req }) => {
        invalidatePortfolioCache(req, PROJECTS_CACHE_TAG)
        return doc
      },
    ],
    afterDelete: [
      ({ doc, req }) => {
        invalidatePortfolioCache(req, PROJECTS_CACHE_TAG)
        return doc
      },
    ],
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'room',
          label: 'Portfolio Room',
          type: 'select',
          required: true,
          options: [
            { label: '01 — ML / AI Engineer', value: 'ai' },
            { label: '02 — Web Developer', value: 'software' },
            { label: '03 — Graphic Designer', value: 'design' },
          ],
          admin: { width: '50%' },
        },
        {
          name: 'index',
          label: 'Display Order (e.g. 01, 02)',
          type: 'text',
          required: true,
          defaultValue: '01',
          admin: { width: '50%' },
        },
      ],
    },
    { name: 'title', type: 'text', required: true },
    {
      name: 'kicker',
      label: 'Category / Kicker',
      type: 'text',
      required: true,
      admin: { placeholder: 'MULTIMODAL RESEARCH ASSISTANT' },
    },
    { name: 'description', type: 'textarea', required: true },
    {
      name: 'tags',
      label: 'Tech Stack / Tools',
      type: 'array',
      minRows: 1,
      maxRows: 8,
      fields: [{ name: 'name', type: 'text', required: true }],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'metric',
          label: 'Highlight Metric',
          type: 'text',
          admin: { width: '35%', placeholder: '92.4% recall' },
        },
        {
          name: 'accent',
          label: 'Card Accent Hex',
          type: 'text',
          defaultValue: '#dfe8ff',
          admin: { width: '35%', placeholder: '#dfe8ff' },
        },
        {
          name: 'visual',
          label: 'Fallback Illustration Style',
          type: 'select',
          defaultValue: 'network',
          options: [
            { label: 'Network', value: 'network' },
            { label: 'Vision', value: 'vision' },
            { label: 'Bars', value: 'bars' },
            { label: 'Terminal', value: 'terminal' },
            { label: 'Dashboard', value: 'dashboard' },
            { label: 'Chart', value: 'chart' },
          ],
          admin: { width: '30%' },
        },
      ],
    },
    {
      name: 'coverImage',
      label: 'Preview / Artwork Image (Optional)',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'galleryImages',
      label: 'Design Series / Clothesline Gallery (Multiple Posters)',
      type: 'array',
      admin: {
        condition: (data) => data?.room === 'design',
        description: 'Upload multiple posters/slides for this design project to hang on its clothesline.',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'caption',
          type: 'text',
          admin: { placeholder: 'e.g. Editorial layout 01' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'liveUrl', label: 'Live Demo URL', type: 'text', admin: { width: '50%' } },
        { name: 'repoUrl', label: 'GitHub / Source URL', type: 'text', admin: { width: '50%' } },
      ],
    },
  ],
}